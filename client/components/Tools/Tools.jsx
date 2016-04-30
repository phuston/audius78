import React, { Component } from 'react';
import { playingMode, toolMode, selectColor } from '../../../utils.js';

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
    this.changeToSelect = this.changeToSelect.bind(this);
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

  changeToSelect() {
    this.props.setToolMode(toolMode.SELECT);
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
    let cursorStyle, splitStyle, dragStyle, selectStyle;

    if (this.props.toolMode === toolMode.CURSOR) {
      cursorStyle = {'backgroundColor': selectColor};
    } else if (this.props.toolMode === toolMode.SPLIT) {
      splitStyle = {'backgroundColor': selectColor};
    } else if (this.props.toolMode === toolMode.DRAG) {
      dragStyle = {'backgroundColor': selectColor};
    } else if (this.props.toolMode === toolMode.SELECT) {
      selectStyle = {'backgroundColor': selectColor};
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
        <input type='button' value='Select'
          className={styles.select}
          onClick={this.changeToSelect}
          style={selectStyle} />
        <input type='button' value='Delete'
          onClick={this.props.deleteSelected} />
        <input type='button' value='Zoom In'
          onClick={this.zoomIn} />
        <input type='button' value='Zoom Out'
          onClick={this.zoomOut} />
      </div>
    )
  }
}

export default Tools;
