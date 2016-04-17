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

    let dispatch = this.props.dispatch;
    let audioCtx = new (window.AudioContext || window.webkitAudioContexet)();
    dispatch(workspaceActions.audioContext(audioCtx));
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.workspace.id) {
      if (this.props.workspace instanceof Promise) {
        this.props.workspace.then((workspace) => {
          let dispatch = this.props.dispatch;
          let socket = io();

          // dispatch(workspaceActions.socketConnection(socket));

          socket.emit('newWorkspace', workspace.id);
          socket.on('workspaceCreated', (data) => {
            socket = io('/' + workspace.id);
          });
        });
      }
    }
  }

  onDrop(files){
    console.log(files);
    console.log(this.props);
    var socket = this.props.workspace.socket;
    //this.props.workspace.socket.emit('fileUpload', files[0].name);
  }

  render() {
    return (
      <div className={styles.page} >
        <Navbar className={styles.navbar}/>

        <div><h1>{this.props.workspace.id}</h1></div>

        <div className={styles.workspace} >

          <Toolbar className={styles.toolbar}/>

          <div className={styles.songs}>
            <TrackBox className={styles.trackbox}/>
          </div>

          <Dropzone onDrop={this.onDrop}/>

        </div>
      </div>
    )
  }
}
/*
          <form 
            id =  "uploadForm"
            encType = "multipart/form-data"
            action =  "/api/upload"
            method =  "post"
            className={styles.uploadform} >
            
            <input type="file" name="song" className={styles.filechoose} />
            <input type="submit" value="Upload" name="submit" className={styles.upload} />
          </form>
*/

export default connect(x=>x)(Workspace);
