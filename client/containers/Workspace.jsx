// Outside
import React, { Component } from 'react';
import { connect } from 'react-redux';

//Containers
import TrackBox from './TrackBox.jsx'
import Navbar from './NavbarBox.jsx'
import Toolbar from './Toolbar.jsx'

//Styling 
import styles from './Containers.scss'

class Workspace extends Component{
  componentDidUpdate(prevProps, prevState) {
    console.log('prevProps', prevProps);
    console.log('currProps', this.props);
    if (!prevProps.workspace.id) {
      console.log('getting hash', this.props.workspace.id);

      let hash = 'UDIU78'; // Get hash from store
      let socket = io();
      socket.emit('newWorkspace', hash);
      socket.on('workspaceCreated', function (data) {
        socket = io('/' + hash);
        // console.log(socket);
      });
      return null;
    }
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
