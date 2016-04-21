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
    this.onDrop = this.onDrop.bind(this);
    this.playMusic = this.playMusic.bind(this);

    // BindActions
    let dispatch = this.props.dispatch;
    this.togglePlaying = (playing) => dispatch(workspaceActions.togglePlaying(playing));
    this.updateTimescale = (left) => dispatch(workspaceActions.updateTimescale(left));
    this.updateZoom = this.updateZoom.bind(this);
    this.stopPlaying = () => dispatch(workspaceActions.stopPlaying(playingMode.STOP));
  }

  updateZoom(newZoom) {
    let zoomRatio = this.props.workspace.zoomLevel/newZoom;
    this.props.dispatch(workspaceActions.updateZoom(newZoom));
    let newLeft = ((this.props.workspace.timing.left) * zoomRatio);
    if (newZoom <= zoomLimits.UPPER && newZoom >= zoomLimits.LOWER) {
      this.updateTimescale(newLeft);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let dispatch = this.props.dispatch;

    if (!prevProps.workspace.id) {
      let socket = io();

      socket.emit('newWorkspace', this.props.workspace.id);
      socket.on('workspaceCreated', (data) => {
        socket = io('/' + this.props.workspace.id);
      });
    }

    if( this.props.workspace.playing !== prevProps.workspace.playing){
      let playingState = this.props.workspace.playing;

      if( playingState === playingMode.PLAYING ){
        console.log("play now!");
        if(this.props.workspace.audioCtx === undefined){
          let audioCtx = this.playMusic();
          dispatch(workspaceActions.audioContext(audioCtx));
        } else {
          let audioCtx = this.props.workspace.audioCtx;
          audioCtx.resume();
        }
      } else if( playingState === playingMode.PAUSE){
        console.log("Pause me bro!");
        if( this.props.workspace.playing === playingMode.PAUSE ){
          let audioCtx = this.props.workspace.audioCtx;
          audioCtx.suspend();
        }
      } else if( playingState === playingMode.STOP ){
        console.log("Destroy the play!");

        let audioCtx = this.props.workspace.audioCtx;
        audioCtx.close();

        dispatch(workspaceActions.audioContext(undefined));
      }
    }
  }

  onDrop(files){
    var data = new FormData();
    data.append('file', files[0]);
    data.append('name', 'song');

    fetch('/api/upload', {
      method: 'POST',
      body: data
    })
    .then( function(res){
      // Handle socket business here such as:
      //var socket = this.props.workspace.socket;
      //this.props.workspace.socket.emit('fileUpload', res);
    }.bind(this))
    .catch( function(err){
      console.error(err);
    });
  }

  playMusic(){
    let audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    let workspace = this.props.workspace;
    let sources = workspace.rows.map( function(elem){
      let source = audioCtx.createBufferSource();
      source.buffer = elem.rawAudio;
      source.connect(audioCtx.destination);

      return source;
    });

    sources.map( function(elem){
      elem.start();
    });
    //audioCtx.close();
    //
    return audioCtx;
  }

  render() {
    return (
      <div className={styles.page} >
        <Navbar className={styles.navbar}/>

        <div><h1>{this.props.workspace.id}</h1></div>

        <div className={styles.workspace} >

          <Toolbar className={styles.toolbar} 
            togglePlaying={this.togglePlaying} 
            playing={this.props.workspace.playing}
            updateZoom={this.updateZoom}
            currentZoom={this.props.workspace.zoomLevel}
            stopPlaying={this.stopPlaying}/>

          <div className={styles.songs}>
            <TrackBox className={styles.trackbox} workspace={this.props.workspace} updateTimescale={this.updateTimescale}/>
          </div>

          <Dropzone onDrop={this.onDrop}/>
        </div>
      </div>
    )
  }
}

export default connect(x=>x)(Workspace);
