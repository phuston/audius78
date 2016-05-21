// Outside
import React, { Component } from 'react';
import { playingMode, toolMode, selectedColor } from '../../../utils.js';

// Styling
import styles from './Tools.scss';

// Material
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import IconButton from 'material-ui/lib/icon-button';

// Material Icons
import ActionZoomIn from 'material-ui/lib/svg-icons/action/zoom-in';
import ActionZoomOut from 'material-ui/lib/svg-icons/action/zoom-out';
import Stop from 'material-ui/lib/svg-icons/av/stop';
import LocationSearch from 'material-ui/lib/svg-icons/device/location-searching';
import Scissor from 'material-ui/lib/svg-icons/content/content-cut';
import Delete from 'material-ui/lib/svg-icons/action/delete';
import Hand from 'material-ui/lib/svg-icons/action/pan-tool';
import OpenWith from 'material-ui/lib/svg-icons/action/open-with';
import Play from 'material-ui/lib/svg-icons/av/play-arrow';
import Pause from 'material-ui/lib/svg-icons/av/pause';
import CompareArrows from 'material-ui/lib/svg-icons/action/compare-arrows';
import SystemUpdateAlt from 'material-ui/lib/svg-icons/action/system-update-alt';

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
    this.exportRecording = this.export.bind(this);
    this.removeBlocks = this.removeBlocks.bind(this);
    this.joinBlocks = this.joinBlocks.bind(this);
    this.areButtonsEnabled = this.areButtonsEnabled.bind(this);
  }

  setPlayingMode() {
    this.props.ee.emit('playPause');
  }

  changeToCursor() {
    this.props.ee.emit('cursor');
  }

  changeToSplit() {
    this.props.ee.emit('split');
  }

  changeToDrag() {
    this.props.ee.emit('drag');
  }

  changeToSelect() {
    this.props.ee.emit('select');
  }
  
  export() {
    this.props.ee.emit('export');
  }

  stopPlaying(){
    this.props.ee.emit('stop');
    // Change seeker to cursor position
    this.props.ee.emit('setSeeker', this.props.cursor); 
  }

  removeBlocks() {
    this.props.ee.emit('removeBlocks');
  }

  joinBlocks() {
    this.props.ee.emit('spliceBlocks');
  }

  zoomIn() {
    this.props.ee.emit('zoomIn');
  }

  zoomOut() {
    this.props.ee.emit('zoomOut');
  }
  
  areButtonsEnabled() {
    return this.props.playing !== playingMode.EXPORT;
  }
  
  render() {
    // Change cursor apperance 
    let cursorColor, splitColor, dragColor, selectColor;

    switch (this.props.toolMode) {
      case toolMode.CURSOR:
        cursorColor = selectedColor;
        break;

      case toolMode.SPLIT:
        splitColor = selectedColor;
        break;

      case toolMode.DRAG:
        dragColor = selectedColor;
        break;

      case toolMode.SELECT:
        selectColor = selectedColor;
        break;
    }

    return (
      <div className = {styles.tools} >
        <Toolbar style={{'boxShadow':'0 1px 3px rgba(0,0,0,0.16), 0 1px 3px rgba(0,0,0,0.23)'}}>
          <ToolbarGroup firstChild={true} float="left">
            <ToolbarTitle className={styles.titletext} text="Toolbar" />

              <IconButton onClick={this.setPlayingMode} tooltip="Play/Pause (spacebar) " disabled={!this.areButtonsEnabled()}> 
                {this.props.playing === playingMode.PLAYING ? <Pause /> : <Play />} 
              </IconButton>

              <IconButton onClick={this.stopPlaying} tooltip="Stop (S)" disabled={!this.areButtonsEnabled()}>
                <Stop />
              </IconButton>

              <IconButton onClick={this.changeToCursor} tooltip="Cursor (C)" disabled={!this.areButtonsEnabled()}>
                <LocationSearch color={cursorColor}/>
              </IconButton>

              <IconButton onClick={this.changeToDrag} tooltip="Drag (D)" disabled={!this.areButtonsEnabled()}>
                <OpenWith color={dragColor} />
              </IconButton>

              <IconButton onClick={this.changeToSplit} tooltip="Split (X)" disabled={!this.areButtonsEnabled()}>
                <Scissor color={splitColor} />
              </IconButton>

              <IconButton onClick={this.changeToSelect} tooltip="Pick (P)" disabled={!this.areButtonsEnabled()}>
                <Hand color={selectColor} />
              </IconButton>

              <IconButton onClick={this.removeBlocks} tooltip="Delete (delete)" disabled={!this.areButtonsEnabled()}>
                <Delete />
              </IconButton>

              <IconButton onClick={this.joinBlocks} tooltip="Join (J)" disabled={!this.areButtonsEnabled()}>
                <CompareArrows />
              </IconButton>
              
              <IconButton onClick={this.exportRecording} tooltip="Export" disabled={!this.areButtonsEnabled()}>
                <SystemUpdateAlt />
              </IconButton>
          </ToolbarGroup>

          <ToolbarGroup float="right">
            <IconButton onClick={this.zoomOut} tooltip="Zoom Out (Q)">
             <ActionZoomOut />
            </IconButton>

            <IconButton onClick={this.zoomIn} tooltip="Zoom In (W)">
             <ActionZoomIn />
            </IconButton>

          </ToolbarGroup>
        </Toolbar>
      </div>
    );
  }
}

export default Tools;
