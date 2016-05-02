// Outside
import React, { Component } from 'react';
import { playingMode, toolMode, selectColor } from '../../../utils.js';

// Styling
import styles from './Tools.scss';

// Material
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import IconButton from 'material-ui/lib/icon-button';
import ActionZoomIn from 'material-ui/lib/svg-icons/action/zoom-in';
import ActionZoomOut from 'material-ui/lib/svg-icons/action/zoom-out';
import RaisedButton from 'material-ui/lib/raised-button';
import FontIcon from 'material-ui/lib/font-icon';





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
        <Toolbar >

          <ToolbarGroup firstChild={true} float="left">
            <ToolbarTitle text="Toolbar" />
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
          </ToolbarGroup>

          <ToolbarGroup float="right">

            <IconButton 
              tooltip="Zoom In!"
              iconClassName="material-icons"
              onClick={this.zoomIn}>zoom_in </IconButton>

            <IconButton 
              tooltip="Zoom Out!"
              iconClassName="material-icons"
              onClick={this.zoomIn}>zoom_out </IconButton>

          </ToolbarGroup>

        </Toolbar>
      </div>
    )
  }
}

export default Tools;
