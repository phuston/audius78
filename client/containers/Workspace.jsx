// Outside
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';
import { routeActions } from 'redux-simple-router';
import Dropzone from 'react-dropzone';
import { playingMode, zoomLimits, toolMode } from '../../utils.js';


//Containers
import TrackBox from './TrackBox.jsx';
import Navbar from '../components/Navbar/Navbar.jsx'
import Toolbar from './Toolbar.jsx';

// Outside
import * as workspaceActions from '../actions/workspace.js';
import TimeRuler from '../components/TimeRuler/TimeRuler.jsx'

//Styling 
import styles from './Containers.scss';

class Workspace extends Component {

  constructor(props) {
    super(props);

    this.socket = io('http://localhost:3000');
    this.audioCtx = undefined;
    this.startTime = 0;
    this.cursorTime = 0;
    this.countingBlocks = 0;
    this.userLoggingOut = false;
    this.sourceBuffers = [];
    this.onDrop = this.onDrop.bind(this);

    this.playMusic = this.playMusic.bind(this);
    this.seekTime = this.seekTime.bind(this);
    this.setZoom = this.setZoom.bind(this);
    this.handleAudioBlockEnding = this.handleAudioBlockEnding.bind(this);

    this.addRow = (newRow, audioCtx) => dispatch(workspaceActions.addRow(newRow, audioCtx));
    this.removeRow = (updatedRows) => dispatch(workspaceActions.removeRow(updatedRows));
    this.flagBlock = (newFlags) => dispatch(workspaceActions.flagBlock(newFlags));
    this.splitBlock = (newBlocks) => dispatch(workspaceActions.splitBlock(newBlocks));
    this.moveBlock = (newBlocks) => dispatch(workspaceActions.moveBlock(newBlocks));
    this.removeBlocks = (newBlocksPerRow) => dispatch(workspaceActions.removeBlocks(newBlocksPerRow));
    this.emitRemoveBlocks = this.emitRemoveBlocks.bind(this);
    this.emitRemoveRow = this.emitRemoveRow.bind(this);
    this.emitChangeRowGain = this.emitChangeRowGain.bind(this);

    // Bind Actions
    let dispatch = this.props.dispatch;
    this.setToolMode = (mode) => dispatch(workspaceActions.setToolMode(mode));
    this.setSpeed = (speed) => dispatch(workspaceActions.setSpeed(speed));
    this.toggleRowDelete = (status) => dispatch(workspaceActions.toggleRowDelete(status));
    this.setPlayingMode = (playing) => dispatch(workspaceActions.setPlayingMode(playing));
    this.setSeeker = (seeker) => dispatch(workspaceActions.setSeeker(seeker));
    this.setCursor = (cursor) => dispatch(workspaceActions.setCursor(cursor));
    this.stopPlaying = () => dispatch(workspaceActions.stopPlaying(playingMode.STOP));
    this.setAudioContext = (audioCtx) => dispatch(workspaceActions.setAudioContext(audioCtx));
    this.logout = () => {
      dispatch(workspaceActions.setPlayingMode(playingMode.STOP));
      this.userLoggingOut = true;
    };
    this.setRowGain = (info) => dispatch(workspaceActions.setRowGain(info));
    this.highlightBlock = (blockInfo) => dispatch(workspaceActions.highlightBlock(blockInfo));
    this.setWorkspaceWidth = (width) => {
      let widthOfWaveforms = Math.min(this.props.workspace.width, width+150);
      dispatch(workspaceActions.setWorkspaceWidth( Math.max(width+150, document.documentElement.clientWidth) ));
    }
  }

  emitChangeRowGain(gainOperation) {
    this.socket.emit('changeRowGain', gainOperation);
  }

  emitRemoveRow(rowId) {
    if (this.props.workspace.allowRowDelete === true)
      this.socket.emit('removeRow', {rowId: rowId});
  }

  emitRemoveBlocks() {
    let removeBlockOperation = {};
    let isEmpty = true;
    Array.prototype.map.call(this.props.workspace.rows, (row) => {
      let blocksToDelete = [];
      row.audioBlocks.map( (block) => {
        isEmpty = isEmpty && (!block.selected);
        if (block.selected) blocksToDelete.push(block._id);
      });

      removeBlockOperation[row._id] = blocksToDelete;
    });

    if (!isEmpty && this.props.workspace.playing !== playingMode.PLAYING) this.socket.emit('removeBlocks', removeBlockOperation);
  }

  setZoom(newZoom) {
    let zoomRatio = this.props.workspace.zoomLevel/newZoom;
    this.props.dispatch(workspaceActions.setZoom(newZoom));
    let newSeeker = this.props.workspace.timing.seeker * zoomRatio;
    let newCursor = this.props.workspace.timing.cursor * zoomRatio;
    if (newZoom <= zoomLimits.UPPER && newZoom >= zoomLimits.LOWER) {
      this.setSeeker(newSeeker);
      this.setCursor(newCursor);
    }
  }

  componentDidMount() {
    let dispatch = this.props.dispatch;

    this.socket.emit('connectWorkspace', 'patrick', this.props.workspace.id);

    this.socket.on('applyAddRow', applyOperation => {
      let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.addRow(applyOperation, audioCtx);
      this.rerenderAudio = true;
    });

    this.socket.on('applyRemoveRow', updatedRows => {
      this.removeRow(updatedRows);
      this.rerenderAudio = true;
    });

    this.socket.on('applyRemoveBlocks', newBlocksPerRow => {
      this.removeBlocks(newBlocksPerRow);
      this.rerenderAudio = true;
    });

    this.socket.on('applySetGain', newRowGain => {
      this.setRowGain(newRowGain);
      this.rerenderAudio = true;
    });

    this.socket.on('applyFlagBlock', flagOperation => {
      this.flagBlock(flagOperation);
      this.rerenderAudio = true;
    });

    this.socket.on('applySplitBlock', splitOperation => {
      this.splitBlock(splitOperation);
      this.rerenderAudio = true;
    });

    this.socket.on('applyMoveBlock', moveOperation => {
      this.moveBlock(moveOperation);
      this.rerenderAudio = true;
    });

    window.addEventListener('scroll', (e) => {
      dispatch(workspaceActions.setScroll(window.pageXOffset - (document.documentElement.clientLeft || 0) ));
    });
  }

  componentDidUpdate(prevProps, prevState) {
    let dispatch = this.props.dispatch;
    if (this.userLoggingOut) {
      dispatch(routeActions.push('/'));
      dispatch(workspaceActions.setSeeker(0));
      dispatch(workspaceActions.setZoom(1));
      dispatch(workspaceActions.setCursor(0));
      dispatch(workspaceActions.setScroll(0));
      dispatch(workspaceActions.setWorkspaceWidth('1600'));
      dispatch(workspaceActions.toggleRowDelete(true));
      dispatch(workspaceActions.setToolMode(toolMode.CURSOR));
    }
    // If row added or deleted, allow row delete
    if (this.props.workspace.rows.length !== prevProps.workspace.rows.length) {
      this.toggleRowDelete(true);
    }
    if (this.props.workspace.playing !== prevProps.workspace.playing) {
      switch (this.props.workspace.playing) {
        case (playingMode.PLAYING):
          if (this.audioCtx === undefined || this.rerenderAudio) {
            // This means last state was STOP
            this.setSeeker(this.props.workspace.timing.cursor);
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.playMusic();
          } else {
            // This means last state was PAUSE
            this.audioCtx.resume();
          }
          break;

        case (playingMode.PAUSE):
          this.audioCtx.suspend();
          // Have to reset the seeker to handle a bug when repeatedly hitting pause/play
          this.setSeeker((this.startTime+this.audioCtx.currentTime) * this.props.workspace.timing.speed);
          break;

        case (playingMode.STOP):
          // Close and remove audo context
          this.audioCtx.close();
          this.audioCtx = undefined;

          // Have to reset the cursor to handle a bug when repeatedly hitting stop/play
          this.startTime = this.props.workspace.timing.cursor / this.props.workspace.timing.speed;
          break;
      }
    } else if ( this.props.workspace.playing === playingMode.STOP ){
      // This handles the case when seeking while play is stopped.
      this.startTime = this.props.workspace.timing.cursor / this.props.workspace.timing.speed;
    }
  }

  onDrop(files){
    let data = new FormData();
    console.log(files[0].name);
    data.append('file', files[0]);
    data.append('name', files[0].name);
    data.append('workspaceId', this.props.workspace.id);
    data.append('rowIndex', this.props.workspace.rows.length);

    // Disable row delete to allow indices of workspace.rows to sync properly
    this.toggleRowDelete(false);

    fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: data
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let addRowOperation = {
        workspaceId: this.props.workspace.id,
        rowId: data.rowId
      }
      this.socket.emit('addRow', addRowOperation);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  handleAudioBlockEnding() {
    this.countingBlocks++;
    // console.log(this.countingBlocks, this.numBlocks);
    if (this.countingBlocks === this.numBlocks) {
      this.setPlayingMode(playingMode.STOP);
      this.setSeeker(this.props.workspace.timing.cursor);
      this.countingBlocks = 0;
    }
  }

  playMusic(){
    this.rerenderAudio = false;
    this.numBlocks = 0;

    let workspace = this.props.workspace;
    const samplesPerPeak = workspace.zoomLevel * 2000;
    const pixelsPerSec = this.props.workspace.timing.speed * workspace.zoomLevel;

    let sourceBuffers = Array.prototype.map.call(workspace.rows, (row) => {
      let blocks = Array.prototype.map.call(row.audioBlocks, (audioBlock, i)=>{

        let block = {};
        let gainNode = this.audioCtx.createGain();

        // Connect the graph of audio
        block.source = this.audioCtx.createBufferSource();
        block.source.buffer = row.rawAudio;
        block.source.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        let rawAudioLength = block.source.buffer.length;
        let duration = block.source.buffer.duration;

        // Set volume
        gainNode.gain.value = row.gain;

        // Offsets are an array element into audio file and not time;
        // this converts them to time offsets
        let audioEnd = audioBlock.file_end * 1000 * duration / rawAudioLength;

        block.audioOffset = audioBlock.file_offset * 1000 * duration / rawAudioLength;
        block.duration = (audioEnd || duration) - block.audioOffset;
        block.delayTime = audioBlock.row_offset / pixelsPerSec;
        this.numBlocks++;
        return block;
      });

      return blocks;
    });

    sourceBuffers.map( (row) => {
      row.map( (block, i) => {
        let delay = block.delayTime - this.startTime;
        if (delay >= 0) {
          block.source.start(delay, block.audioOffset, block.duration);
        } else if (-delay < block.duration) {
          block.source.start(0, block.audioOffset-delay, block.duration+delay);
        } else {
          this.countingBlocks++;
        }
        block.source.onended = () => this.handleAudioBlockEnding();
      });
    });
  }

  seekTime(time) {
    this.startTime = time;
    if( this.props.workspace.playing === playingMode.PLAYING ){
      this.audioCtx.close();
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.countingBlocks = 0;
      this.playMusic();
    }
  }

  render() {
    let workspace;
    if (this.props.workspace.rows.length > 0) {
      workspace = (
        <div>
          <TimeRuler workspace={this.props.workspace}/>
          <div className={styles.songs}>
            <TrackBox className={styles.trackbox} 
              socket={this.socket}
              workspace={this.props.workspace} 
              highlightBlock={this.highlightBlock}
              emitRemoveRow={this.emitRemoveRow}
              setCursor={this.setCursor}
              setSeeker={this.setSeeker}
              seekTime={this.seekTime}
              setSpeed={this.setSpeed}
              emitChangeRowGain={this.emitChangeRowGain}
              setWorkspaceWidth={this.setWorkspaceWidth}
            />
          </div>
        </div>
      );
    } else {
      workspace = (
        <div style={{'marginTop': '212px', 'position': 'fixed', 'height': '70px'}}>
          <h1>Upload a file to start using the Audius78 editor!</h1>
        </div>
      );
    }

    return (
      <div className={styles.page} >
        <div className = {styles.navbar} >
          <Navbar 
            onLogout={this.logout}
            workspaceWidth = {this.props.workspace.width}
            workspaceId = {this.props.workspace.id} />
        </div>


        <div style={{'top': '70px', 'position': 'fixed', 'height': '70px', 'zIndex': '100', 'backgroundColor': '#FFFFFF', 'width': this.props.workspace.width}}></div>

        <div className={styles.workspace} style={{'width': this.props.workspace.width}}>

          <Toolbar className={styles.toolbar} 
            setPlayingMode={this.setPlayingMode} 
            playing={this.props.workspace.playing}
            deleteSelected={this.emitRemoveBlocks}
            toolMode={this.props.workspace.toolMode}
            setZoom={this.setZoom}
            currentZoom={this.props.workspace.zoomLevel}
            stopPlaying={this.stopPlaying}
            setSeeker={this.setSeeker}
            setToolMode={this.setToolMode}
            cursor={this.props.workspace.timing.cursor} />

          {workspace}

          <div style={{'position': 'absolute', 'bottom': '0', 'width': '100px', 'height': '100px'}}>
            <Dropzone onDrop={this.onDrop} />
          </div>
        </div>
      </div>
    )
  }
}

export default connect(x=>x)(Workspace);
