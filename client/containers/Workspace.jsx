// Outside
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';
import { routeActions } from 'redux-simple-router';
import { playingMode, zoomLimits, toolMode } from '../../utils.js';
import * as workspaceActions from '../actions/workspace.js';
import EventEmitter from 'event-emitter';
import KeybindingMixin from 'react-keybinding-mixin';

// Containers + Components
import TrackBox from './TrackBox.jsx';
import Navbar from '../components/Navbar/Navbar.jsx';
import Toolbar from './Toolbar.jsx';
import Seeker from '../components/Seeker/Seeker.jsx';
import Cursor from '../components/Cursor/Cursor.jsx';
import Dropzone from 'react-dropzone';
import TimeRuler from '../components/TimeRuler/TimeRuler.jsx'

// Styling 
import styles from './Containers.scss';

// Material
import Snackbar from 'material-ui/lib/snackbar';

class Workspace extends Component {

  constructor(props) {
    super(props);

    this.socket = io('');
    this.audioCtx = undefined;
    this.startTime = 0;
    this.cursorTime = 0;
    this.countingBlocks = 0;
    this.userLoggingOut = false;
    this.sourceBuffers = [];
    this.onDrop = this.onDrop.bind(this);
    this.ee = new EventEmitter();

    this.ee.on('playPause', () => {
      if (this.isPlaying()) 
        this.setPlayingMode(playingMode.PAUSE);
      else
        this.setPlayingMode(playingMode.PLAYING);
    });

    this.ee.on('stop', () => {
      this.setPlayingMode(playingMode.STOP);
    });

    this.ee.on('cursor', () => {
      this.setToolMode(toolMode.CURSOR);
    });

    this.ee.on('split', () => {
      this.setToolMode(toolMode.SPLIT);
    });

    this.ee.on('drag', () => {
      this.setToolMode(toolMode.DRAG);
    });

    this.ee.on('select', () => {
      this.setToolMode(toolMode.SELECT);
    });

    this.ee.on('zoomIn', () => {
      if (!this.isPlaying())
        this.setZoom(this.props.workspace.zoomLevel / 2);
    });

    this.ee.on('zoomOut', () => {
      if (!this.isPlaying())
        this.setZoom(this.props.workspace.zoomLevel * 2);
    });

    this.ee.on('splitBlock', (rowId, blockId, splitElement) => {
      const splitOperation = {
        rowId: rowId,
        blockId: blockId,
        operation: {
          splitElement: splitElement
        }
      };
      this.socket.emit('splitBlock', splitOperation);
    });

    this.ee.on('moveBlock', (rowId, blockId, moveShift) => {
      const moveOperation = {
        rowId: rowId,
        blockId: blockId,
        operation: {
          moveShift: moveShift
        }
      };
      this.socket.emit('moveBlock', moveOperation);
    });

    this.ee.on('flagBlock', (rowId, blockId, flagType, startTime, duration) => {
      const flagOperation = {
        rowId: rowId,
        blockId: blockId,
        operation: {
          type: flagType,
          startTime: startTime,
          duration: duration
        }
      };
      this.socket.emit('flagBlock', flagOperation);
    });

    this.ee.on('setSeeker', (position) => {
      this.setSeeker(position);
    });

    this.ee.on('setCursor', (position) => {
      this.setCursor(position);
    });

    this.ee.on('seekTime', (time) => {
      this.seekTime(time);
    });

    this.ee.on('setSpeed', (speed) => {
      this.setSpeed(speed);
    });

    this.ee.on('setRowGain', (gainOperation) => {
      this.socket.emit('changeRowGain', gainOperation);
    });

    this.ee.on('setWidth', (width) => {
      let widthOfWaveforms = Math.min(this.props.workspace.width, width+150);
      dispatch(workspaceActions.setWorkspaceWidth( Math.max(width+150, document.documentElement.clientWidth) ));
    });

    this.ee.on('removeRow', (rowId) => {
      if (this.props.workspace.allowRowDelete === true)
        this.socket.emit('removeRow', {rowId: rowId});
    });

    this.ee.on('removeBlocks', () => {
      this.emitRemoveBlocks();
    });

    this.ee.on('spliceBlocks', () => {
      this.emitSpliceBlocks();
    })

    this.ee.on('highlightBlock', (blockInfo) => {
      this.highlightBlock(blockInfo);
    });

    this.playMusic = this.playMusic.bind(this);
    this.isPlaying = this.isPlaying.bind(this);
    this.seekTime = this.seekTime.bind(this);
    this.setZoom = this.setZoom.bind(this);
    this.handleAudioBlockEnding = this.handleAudioBlockEnding.bind(this);

    // Server side events
    this.addRow = (newRow, audioCtx) => dispatch(workspaceActions.addRow(newRow, audioCtx));
    this.removeRow = (updatedRows) => dispatch(workspaceActions.removeRow(updatedRows));
    this.flagBlock = (newFlags) => dispatch(workspaceActions.flagBlock(newFlags));
    this.splitBlock = (newBlocks) => dispatch(workspaceActions.splitBlock(newBlocks));
    this.moveBlock = (newBlocks) => dispatch(workspaceActions.moveBlock(newBlocks));
    this.removeBlocks = (newBlocksPerRow) => dispatch(workspaceActions.removeBlocks(newBlocksPerRow));
    this.spliceBlocks = (newBlocksPerRow) => dispatch(workspaceActions.spliceBlocks(newBlocksPerRow));
    this.emitRemoveBlocks = this.emitRemoveBlocks.bind(this);
    this.emitSpliceBlocks = this.emitSpliceBlocks.bind(this);

    // Client side events
    let dispatch = this.props.dispatch;
    this.setToolMode = (mode) => dispatch(workspaceActions.setToolMode(mode));
    this.setSpeed = (speed) => dispatch(workspaceActions.setSpeed(speed));
    this.toggleRowDelete = (status) => dispatch(workspaceActions.toggleRowDelete(status));
    this.setPlayingMode = (playing) => dispatch(workspaceActions.setPlayingMode(playing));
    this.setSeeker = (seeker) => dispatch(workspaceActions.setSeeker(seeker));
    this.setCursor = (cursor) => dispatch(workspaceActions.setCursor(cursor));
    this.logout = () => {
      dispatch(workspaceActions.setPlayingMode(playingMode.STOP));
      this.userLoggingOut = true;
    };
    this.setRowGain = (info) => dispatch(workspaceActions.setRowGain(info));
    this.highlightBlock = (blockInfo) => dispatch(workspaceActions.highlightBlock(blockInfo));
  }

  componentDidMount() {

    mixins: [KeybindingMixin];
    let dispatch = this.props.dispatch;

    this.socket.emit('connectWorkspace', 'patrick', this.props.workspace.id);

    window.addEventListener('keydown', (e) => {
      // Key Bindings for different workspace actions
      switch(e.keyCode) {
        case 32:
          this.ee.emit('playPause');
          break;
        case 83:
          this.ee.emit('stop');
          break;
        case 68:
          this.ee.emit('drag');
          break;
        case 88:
          this.ee.emit('split');
          break;
        case 46:
          this.ee.emit('removeBlocks');
          break;
        case 74:
          this.ee.emit('spliceBlocks');
          break;
        case 87:
          this.ee.emit('zoomIn');
          break;
        case 81:
          this.ee.emit('zoomOut');
          break;
        case 80:
          this.ee.emit('select');
          break;
        case 67:
          this.ee.emit('cursor');
          break;
      }
    });

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

    this.socket.on('applySpliceBlocks', newBlocksPerRow => {
      this.spliceBlocks(newBlocksPerRow);
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

    // If user logging out, reset state
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
            this.ee.emit('setSeeker', this.props.workspace.timing.cursor);
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
          this.ee.emit('setSeeker', (this.startTime+this.audioCtx.currentTime) * this.props.workspace.timing.speed);
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

  playMusic(){
    this.rerenderAudio = false;
    this.numBlocks = 0;

    const workspace = this.props.workspace;
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

  isPlaying() {
    return this.props.workspace.playing === playingMode.PLAYING;
  }

  emitRemoveBlocks() {
    let removeBlockOperation = {};
    let isEmpty = true;
    let blocksToDelete = [];

    Array.prototype.map.call(this.props.workspace.rows, (row) => {
      row.audioBlocks.map( (block) => {
        isEmpty = isEmpty && (!block.selected);
        if (block.selected) blocksToDelete.push(block._id);
      });

      removeBlockOperation[row._id] = blocksToDelete;
    });

    if (!isEmpty && !this.isPlaying()) this.socket.emit('removeBlocks', removeBlockOperation);
  }

  emitSpliceBlocks() {
    let spliceOperation = {};
    let selectedBlocks = [];

    Array.prototype.map.call(this.props.workspace.rows, (row) => {
      row.audioBlocks.map( (block) => {
        if (block.selected) {
          block.rowId = row._id;
          selectedBlocks.push(block);
        }
      });
    });

    // Popup errors

    if (selectedBlocks.length !== 2) {
      alert('Operation Not Supported: Can only join two audio blocks');
      return console.log('Can only join two blocks');
    } 

    if (selectedBlocks[0].rowId !== selectedBlocks[1].rowId) {
      alert('Operation Not Supported: Cannot join audio blocks of different tracks')
      return console.log('Blocks don\'t belong to the same track.');
    }

    if (selectedBlocks[0].file_offset === selectedBlocks[1].file_end) {
      spliceOperation.leftBlockId = selectedBlocks[1]._id;
      spliceOperation.rightBlockId = selectedBlocks[0]._id;
      spliceOperation.rowId = selectedBlocks[1].rowId;
    } else if (selectedBlocks[1].file_offset === selectedBlocks[0].file_end) {
      spliceOperation.leftBlockId = selectedBlocks[0]._id;
      spliceOperation.rightBlockId = selectedBlocks[1]._id;
      spliceOperation.rowId = selectedBlocks[1].rowId;
    } else {
      alert('Operation Not Supported: Cannot join adjacent blocks')
      return console.log('Join failed - blocks are not adjacent.');
    }

    if (!this.isPlaying()) this.socket.emit('spliceBlocks', spliceOperation);
  }

  setZoom(newZoom) {
    let zoomRatio = this.props.workspace.zoomLevel/newZoom;
    this.props.dispatch(workspaceActions.setZoom(newZoom));
    let newSeeker = this.props.workspace.timing.seeker * zoomRatio;
    let newCursor = this.props.workspace.timing.cursor * zoomRatio;
    if (newZoom <= zoomLimits.UPPER && newZoom >= zoomLimits.LOWER) {
      this.ee.emit('setSeeker', newSeeker);
      this.ee.emit('setCursor', newCursor);
    }
  }

  onDrop(files){
    let data = new FormData();
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

    if (this.countingBlocks === this.numBlocks) {
      this.ee.emit('stop');
      this.ee.emit('setSeeker', this.props.workspace.timing.cursor);
      this.countingBlocks = 0;
    }
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
          <Seeker position={this.props.workspace.timing.seeker} 
            numRows={this.props.workspace.rows.length}
            playing={this.props.workspace.playing}
            speed={this.props.workspace.timing.speed}
            ee={this.ee}/>

          <Cursor position={this.props.workspace.timing.cursor} 
            numRows={this.props.workspace.rows.length}/>
          <div className={styles.songs}>
            <TrackBox className={styles.trackbox} 
              workspace={this.props.workspace} 
              ee={this.ee} />
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


        <div style={{'top': '90px', 'position': 'fixed', 'height': '90px', 'zIndex': '100', 'backgroundColor': '#FFFFFF', 'width': this.props.workspace.width}}></div>

        <div className={styles.workspace} style={{'width': this.props.workspace.width}}>

          <Toolbar className={styles.toolbar} 
            playing={this.props.workspace.playing}
            toolMode={this.props.workspace.toolMode}
            currentZoom={this.props.workspace.zoomLevel}
            cursor={this.props.workspace.timing.cursor} 
            ee={this.ee} />

          {workspace}

          <div className={styles.dropzoneBox}>
            <Dropzone onDrop={this.onDrop} className={styles.dropzone}><span className={styles.addNew}>+</span></Dropzone>
          </div>

        </div>

      </div>
    )
  }
}

export default connect(x=>x)(Workspace);
