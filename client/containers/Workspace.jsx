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

    this.socket = io('http://localhost:3000');
    // TODO: pass this socket connection all the way down to the components that need it

    this.addRow = (newRow, audioCtx) => dispatch(workspaceActions.addRow(newRow, audioCtx));
    this.removeRow = (rowId) => dispatch(workspaceActions.removeRow(rowId));
    this.flagBlock = (newFlags) => dispatch(workspaceActions.flagBlock(newFlags));
    this.splitBlock = (newBlocks) => dispatch(workspaceActions.splitBlock(newBlocks));
    this.moveBlock = (newBlocks) => dispatch(workspaceActions.moveBlock(newBlocks));

    this.togglePlaying = (playing) => dispatch(workspaceActions.togglePlaying(playing));
    this.stopPlaying = () => dispatch(workspaceActions.stopPlaying(playingMode.STOP));
    this.audioContext = (audioCtx) => dispatch(workspaceActions.audioContext(audioCtx));
  }

  componentDidMount() {
    this.socket.emit('connectWorkspace', 'patrick', this.props.workspace.id);

    this.socket.on('addRow', newRow => {
      this.addRow(newRow, audioCtx);
    });

    this.socket.on('removeRow', rowId => {
      this.removeRow(rowId);
    });

    this.socket.on('flagBlock', newFlags => {
      // TODO: Figure out where the row and block Ids will be coming from for this
      this.flagBlock(newFlags);
    });

    this.socket.on('splitBlock', newBlocks => {
      // TODO: Figure out where the rowId will be coming from for this
      this.splitBlock(newBlocks);
    });

    this.socket.on('moveBlock', newBlocks => {
      // TODO: Again, where does the rowId come from? This should be returned as an operation
      this.moveBlock(newBlocks);
    });
  }

  componentDidUpdate(prevProps, prevState) {

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

        this.audioContext(undefined);
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
      this.socket.emit('uploadFile', res);
    }.bind(this))
    .catch( function(err){
      console.error(err);
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
            stopPlaying={this.stopPlaying}
            playing={this.props.workspace.playing} />
            
          <div className={styles.songs}>
            <TrackBox className={styles.trackbox} workspace={this.props.workspace} socket={this.socket} />
          </div>

          <Dropzone onDrop={this.onDrop} />
        </div>
      </div>
    )
  }
}

export default connect(x=>x)(Workspace);
