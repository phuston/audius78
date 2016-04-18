// Outside
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import * as workspaceActions from '../actions/workspace.js'

//Containers
import TrackBox from './TrackBox.jsx'
import Navbar from './NavbarBox.jsx'
import Toolbar from './Toolbar.jsx'


//Styling 
import styles from './Containers.scss'

class Workspace extends Component {

  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
    this.playMusic = this.playMusic.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.workspace.id) {
      let dispatch = this.props.dispatch;
      let socket = io();

      socket.emit('newWorkspace', this.props.workspace.id);
      socket.on('workspaceCreated', (data) => {
        socket = io('/' + this.props.workspace.id);
      });
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
  }

  render() {
    return (
      <div className={styles.page} >
        <Navbar className={styles.navbar}/>

        <div><h1>{this.props.workspace.id}</h1></div>

        <div className={styles.workspace} >

          <Toolbar className={styles.toolbar}/>
          <button onClick={this.playMusic}> Play </button>

          <div className={styles.songs}>
            <TrackBox className={styles.trackbox} workspace={this.props.workspace}/>
          </div>

          <Dropzone onDrop={this.onDrop}/>
        </div>
      </div>
    )
  }
}

export default connect(x=>x)(Workspace);
