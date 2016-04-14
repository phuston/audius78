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

  componentDidMount() {
    let hash = 'UDIU78'; // Get hash from store
    let socket = io();
    console.log(socket);
    socket.emit('newWorkspace', hash);
    socket.on('workspaceCreated', function (data) {
      socket = io('/' + hash);
      console.log(socket);
    })
    return null;
  }

  render() {
    return (
      <div className={styles.page} >
        <Navbar className={styles.navbar}/>

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
