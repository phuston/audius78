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


class Workspace extends Component{
  constructor(props){
    super(props);
    this.onDrop = this.onDrop.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.workspace.id) {
      var socket = io();

      var dispatch = this.props.dispatch;
      dispatch(workspaceActions.socketConnection(socket));

      socket.emit('newWorkspace', this.props.workspace.id);
      socket.on('workspaceCreated', (data) => {
        socket = io('/' + this.props.workspace.id);
      });
      return null;
    }
  }

  onDrop(files){
    console.log(files[0]);
    var data = new FormData();
    data.append('file', files[0]);
    data.append('name', 'song');
    console.log(data);

    fetch('/api/upload', {
      method: 'POST',
      body: data
    })
    .then( function(res){
      var socket = this.props.workspace.socket;
      this.props.workspace.socket.emit('fileUpload', res);
    }.bind(this))
    .catch( function(err){
      console.error(err);
    });
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
          <form 
            id =  "uploadForm"
            encType = "multipart/form-data"
            action =  "/api/upload"
            method =  "post"
            className={styles.uploadform} >
            
            <input type="file" name="song" className={styles.filechoose} />
            <input type="submit" value="Upload" name="submit" className={styles.upload} />
          </form>

        </div>
      </div>
    )
  }
}

export default connect(x=>x)(Workspace);
