// Outside
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { playingMode, zoomLimits } from '../../utils.js';

//Containers
import TrackBox from './TrackBox.jsx';
import Navbar from './NavbarBox.jsx';
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
    this.sourceBuffers = [];
    this.onDrop = this.onDrop.bind(this);

    this.playMusic = this.playMusic.bind(this);

    this.addRow = (newRow, audioCtx) => dispatch(workspaceActions.addRow(newRow, audioCtx));
    this.removeRow = (rowId) => dispatch(workspaceActions.removeRow(rowId));
    this.flagBlock = (newFlags) => dispatch(workspaceActions.flagBlock(newFlags));
    this.splitBlock = (newBlocks) => dispatch(workspaceActions.splitBlock(newBlocks));
    this.moveBlock = (newBlocks) => dispatch(workspaceActions.moveBlock(newBlocks));

    // BindActions
    let dispatch = this.props.dispatch;
    this.togglePlaying = (playing) => dispatch(workspaceActions.togglePlaying(playing));
    this.setSeeker = (seeker) => dispatch(workspaceActions.setSeeker(seeker));
    this.setCursor = (cursor) => dispatch(workspaceActions.setCursor(cursor));
    this.setZoom = this.setZoom.bind(this);
    this.stopPlaying = () => dispatch(workspaceActions.stopPlaying(playingMode.STOP));
    this.setAudioContext = (audioCtx) => dispatch(workspaceActions.setAudioContext(audioCtx));
  }

  setZoom(newZoom) {
    let zoomRatio = this.props.workspace.zoomLevel/newZoom;
    this.props.dispatch(workspaceActions.setZoom(newZoom));
    let newSeeker = ((this.props.workspace.timing.seeker) * zoomRatio);
    if (newZoom <= zoomLimits.UPPER && newZoom >= zoomLimits.LOWER) {
      this.setSeeker(newSeeker);
    }
  }

  componentDidMount() {
    let dispatch = this.props.dispatch;

    this.socket.emit('connectWorkspace', 'patrick', this.props.workspace.id);

    this.socket.on('applyAddRow', applyOperation => {
      let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      console.log(applyOperation);
      this.addRow(applyOperation, audioCtx);
    });

    this.socket.on('applyRemoveRow', rowId => {
      this.removeRow(rowId);
    });

    this.socket.on('applyFlagBlock', newFlags => {
      // TODO: Figure out where the row and block Ids will be coming from for this
      this.flagBlock(newFlags);
    });

    this.socket.on('applySplitBlock', newBlocks => {
      // TODO: Figure out where the rowId will be coming from for this
      this.splitBlock(newBlocks);
    });

    this.socket.on('applyMoveBlock', newBlocks => {
      // TODO: Again, where does the rowId come from? This should be returned as an operation
      this.moveBlock(newBlocks);
    });
  }

  componentDidUpdate(prevProps, prevState) {

    if( this.props.workspace.playing !== prevProps.workspace.playing){
      let playingState = this.props.workspace.playing;

      if( playingState === playingMode.PLAYING ){
        if(this.audioCtx === undefined){
          console.log("New play");
          this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          this.playMusic();
        } else {
          console.log("Old play");
          this.audioCtx.resume();
        }
      } else if( playingState === playingMode.PAUSE){
        console.log('Pause');
        this.audioCtx.suspend();
      } else if( playingState === playingMode.STOP ){
        console.log('Stop');
        this.audioCtx.close();
        this.audioCtx = undefined;
      }
    }
  }

  onDrop(files){
    var data = new FormData();
    data.append('file', files[0]);
    data.append('name', 'song');
    data.append('workspaceId', this.props.workspace.id);

    fetch('/api/upload', {
      method: 'POST',
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
    this.sourceBuffers = Array.prototype.map.call(workspace.rows, function(elem){
      let source = this.audioCtx.createBufferSource();
      source.buffer = elem.rawAudio;
      source.connect(this.audioCtx.destination);

      return source;
    }.bind(this));

    this.sourceBuffers.map( function(elem){
      elem.start();
    });
  }

  render() {
    return (
      <div className={styles.page} >
        <Navbar className={styles.navbar} />

        <div><h1>{this.props.workspace.id}</h1></div>

        <div className={styles.workspace} >

          <Toolbar className={styles.toolbar} 
            togglePlaying={this.togglePlaying} 
            playing={this.props.workspace.playing}
            setZoom={this.setZoom}
            currentZoom={this.props.workspace.zoomLevel}
            stopPlaying={this.stopPlaying}
            setSeeker={this.setSeeker}
            cursor={this.props.workspace.timing.cursor}
            />

          <div className={styles.songs}>
            <TrackBox className={styles.trackbox} 
              workspace={this.props.workspace} 
              setCursor={this.setCursor}
              setSeeker={this.setSeeker}
            />
          </div>

          <Dropzone onDrop={this.onDrop} />
        </div>
      </div>
    )
  }
}

export default connect(x=>x)(Workspace);
