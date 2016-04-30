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

//Styling 
import styles from './Containers.scss';

class Workspace extends Component {

  constructor(props) {
    super(props);
    this.socket = io('http://localhost:3000');
    this.audioCtx = undefined;
    this.time = 0;
    this.cursorTime = 0;
    this.userLoggingOut = false;
    this.sourceBuffers = [];
    this.onDrop = this.onDrop.bind(this);

    this.playMusic = this.playMusic.bind(this);
    this.seekTime = this.seekTime.bind(this);
    this.setZoom = this.setZoom.bind(this);
    
    this.addRow = (newRow, audioCtx) => dispatch(workspaceActions.addRow(newRow, audioCtx));
    this.removeRow = (rowId) => dispatch(workspaceActions.removeRow(rowId));
    this.flagBlock = (newFlags) => dispatch(workspaceActions.flagBlock(newFlags));
    this.splitBlock = (newBlocks) => dispatch(workspaceActions.splitBlock(newBlocks));
    this.moveBlock = (newBlocks) => dispatch(workspaceActions.moveBlock(newBlocks));

    // BindActions
    let dispatch = this.props.dispatch;
    this.setToolMode = (mode) => dispatch(workspaceActions.setToolMode(mode));
    this.setSpeed = (speed) => dispatch(workspaceActions.setSpeed(speed));
    this.setPlayingMode = (playing) => dispatch(workspaceActions.setPlayingMode(playing));
    this.setSeeker = (seeker) => dispatch(workspaceActions.setSeeker(seeker));
    this.setCursor = (cursor) => dispatch(workspaceActions.setCursor(cursor));
    this.stopPlaying = () => dispatch(workspaceActions.stopPlaying(playingMode.STOP));
    this.setAudioContext = (audioCtx) => dispatch(workspaceActions.setAudioContext(audioCtx));
    this.setWorkspaceWidth = (width) => {
      if (width > document.documentElement.clientWidth) {
        dispatch(workspaceActions.setWorkspaceWidth(width + 90));
      }
    }

    this.logout = () => {
      // this.audioCtx.close();
      // this.audioCtx = undefined;
      dispatch(workspaceActions.setPlayingMode(playingMode.STOP));
      this.userLoggingOut = true;
    };

    // this.reroute = () => dispatch(routeActions.push('/'));
    // this.clearRows = () => dispatch(workspaceActions.clearRows());
    // this.resetPlayingMode = () => dispatch(workspaceActions.setPlayingMode(playingMode.STOP));
    // this.resetToolMode = () => dispatch(workspaceActions.setToolMode(toolMode.CURSOR));
    // this.resetSeeker = () => dispatch(workspaceActions.setSeeker(0));
    // this.resetZoom = () => dispatch(workspaceActions.setZoom(1));
    // this.resetCursor = () => dispatch(workspaceActions.setCursor(0));
    // this.resetWorkspaceWidth = () => dispatch(workspaceActions.setWorkspaceWidth('100vw'));
  }

  // logout () {
  //   this.audioCtx.close();
  //   this.audioCtx = undefined;
  //   this.resetPlayingMode();
  //   this.resetToolMode();
  //   this.resetSeeker();
  //   this.resetZoom();
  //   this.resetCursor();
  //   this.resetWorkspaceWidth();
  //   this.clearRows();
  //   this.reroute();
  // }

  setZoom(newZoom) {
    let zoomRatio = this.props.workspace.zoomLevel/newZoom;
    this.props.dispatch(workspaceActions.setZoom(newZoom));
    let newSeeker = ((this.props.workspace.timing.seeker) * zoomRatio);
    let newCursor = ((this.props.workspace.timing.cursor) * zoomRatio);
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
    });

    this.socket.on('applyRemoveRow', rowId => {
      this.removeRow(rowId);
    });

    this.socket.on('applyFlagBlock', newFlags => {
      // TODO: Figure out where the row and block Ids will be coming from for this
      this.flagBlock(newFlags);
    });

    this.socket.on('applySplitBlock', splitOperation => {
      this.splitBlock(splitOperation);
    });

    this.socket.on('applyMoveBlock', newBlocks => {
      // TODO: Again, where does the rowId come from? This should be returned as an operation
      this.moveBlock(newBlocks);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    let dispatch = this.props.dispatch;
    if (this.userLoggingOut) {
      dispatch(routeActions.push('/'));
      dispatch(workspaceActions.setSeeker(0));
      dispatch(workspaceActions.setZoom(1));
      dispatch(workspaceActions.setCursor(0));
      dispatch(workspaceActions.setWorkspaceWidth('100vw'));
    }

    if (this.props.workspace.playing !== prevProps.workspace.playing) {
      switch (this.props.workspace.playing) {
        case (playingMode.PLAYING):
          if (this.audioCtx === undefined) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.playMusic();
          } else {
            this.audioCtx.resume();
          }
          break;

        case (playingMode.PAUSE):
          this.audioCtx.suspend();
          this.setSeeker((this.time+this.audioCtx.currentTime) * this.props.workspace.timing.speed);
          break;

        case (playingMode.STOP):
          this.audioCtx.close();
          this.audioCtx = undefined;
          this.time = this.props.workspace.timing.cursor / this.props.workspace.timing.speed;
          break;
      }
    }
  }

  onDrop(files){
    let data = new FormData();
    data.append('file', files[0]);
    data.append('name', 'song');
    data.append('workspaceId', this.props.workspace.id);
    data.append('rowIndex', this.props.workspace.rows.length);

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

  playMusic(){
    let workspace = this.props.workspace;
    this.sourceBuffers = Array.prototype.map.call(workspace.rows, (elem) => {
      let source = this.audioCtx.createBufferSource();
      source.buffer = elem.rawAudio;
      source.connect(this.audioCtx.destination);

      return source;
    });

    this.sourceBuffers.map( (elem) => {
      elem.start(this.audioCtx.currentTime, this.time);
    });
  }

  seekTime(time) {
    this.time = time;
    if( this.props.workspace.playing === playingMode.PLAYING ){
      this.audioCtx.close();
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.playMusic();
    }
  }

  render() {
    return (
      <div className={styles.page} >
        <div className = {styles.navbar} >
          <Navbar onLogout={this.logout} />
        </div>


        <div style={{'top': '70px', 'position': 'fixed', 'height': '70px'}}><h1>{this.props.workspace.id}</h1></div>

        <div className={styles.workspace} style={{'width': this.props.workspace.width}}>

          <Toolbar className={styles.toolbar} 
            setPlayingMode={this.setPlayingMode} 
            playing={this.props.workspace.playing}
            toolMode={this.props.workspace.toolMode}
            setZoom={this.setZoom}
            currentZoom={this.props.workspace.zoomLevel}
            stopPlaying={this.stopPlaying}
            setSeeker={this.setSeeker}
            setToolMode={this.setToolMode}
            cursor={this.props.workspace.timing.cursor}
            />

          <div className={styles.songs}>
            <TrackBox className={styles.trackbox} 
              socket={this.socket}
              workspace={this.props.workspace} 
              setCursor={this.setCursor}
              setSeeker={this.setSeeker}
              seekTime={this.seekTime}
              setSpeed={this.setSpeed}
              setWorkspaceWidth={this.setWorkspaceWidth}
            />
          </div>

          <Dropzone onDrop={this.onDrop} />
        </div>
      </div>
    )
  }
}

export default connect(x=>x)(Workspace);
