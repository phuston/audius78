import React, { Component } from 'react';
import { playingMode, toolMode } from '../../../utils.js';

import styles from './Tools.scss';

class Tools extends Component{
  constructor(props) {
    super(props);

    this.setPlayingMode = this.setPlayingMode.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.stopPlaying = this.stopPlaying.bind(this);
    this.changeToCursor = this.changeToCursor.bind(this);
    this.changeToDrag = this.changeToDrag.bind(this);
    this.changeToSplit = this.changeToSplit.bind(this);
  }

  setPlayingMode() {
    if( this.props.playing === playingMode.PLAYING ){
      this.props.setPlayingMode(playingMode.PAUSE);
    } else {
      this.props.setPlayingMode(playingMode.PLAYING);
    }
  }

  changeToCursor() {
    this.props.setToolMode(toolMode.CURSOR);
  }

  changeToSplit() {
    this.props.setToolMode(toolMode.SPLIT);
  }

  changeToDrag() {
    this.props.setToolMode(toolMode.DRAG);
  }

  stopPlaying(){
    this.props.stopPlaying();
    this.props.setSeeker(this.props.cursor); // Change this to cursor position
  }

  zoomIn() {
    if (this.props.playing !== playingMode.PLAYING) {
      this.props.setZoom(this.props.currentZoom/2);
    }
  }

  zoomOut() {
    if (this.props.playing !== playingMode.PLAYING) {
      this.props.setZoom(this.props.currentZoom*2);
    }
  }

  render() {
    let cursorStyle, splitStyle, dragStyle;

    if (this.props.toolMode === toolMode.CURSOR) {
      console.log('setting cursor');
      cursorStyle = {'backgroundColor': 'red'};
    } else if (this.props.toolMode === toolMode.SPLIT) {
      console.log('setting split');
      splitStyle = {'backgroundColor': 'red'};
    } else if (this.props.toolMode === toolMode.DRAG) {
      console.log('setting drag');
      dragStyle = {'backgroundColor': 'red'};
    }

    return (
      <div className = {styles.tools} >
        <input type='button' 
          value={this.props.playing === playingMode.PLAYING ? 'Pause' : 'Play'} 
          className={styles.pauseplay} 
          onClick={this.setPlayingMode}/>
        <input type='button' value='Stop' className={styles.stop}
          onClick={this.stopPlaying} />
        <input type='button' value='Cursor' 
          className={styles.cut} 
          onClick={this.changeToCursor}
          style={cursorStyle} />
        <input type='button' value='Drag' 
          className={styles.move} 
          onClick={this.changeToDrag} 
          style={dragStyle} />
        <input type='button' value='Split' 
          className={styles.split} 
          onClick={this.changeToSplit}
          style={splitStyle} />
        <input type='button' value='Zoom In' onClick={this.zoomIn} />
        <input type='button' value='Zoom Out' onClick={this.zoomOut} />
      </div>
    )
  }
}

export default Tools;
