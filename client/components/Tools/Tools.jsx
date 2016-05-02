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
    this.removeBlocks = this.removeBlocks.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.playingMode !== this.props.playingMode ||
      nextProps.toolMode !== this.props.toolMode
    );
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

  stopPlaying(){
    this.props.ee.emit('stop');
    // Change seeker to cursor position
    this.props.ee.emit('setSeeker', this.props.cursor); 
  }

  removeBlocks() {
    this.props.ee.emit('removeBlocks');
  }

  zoomIn() {
    this.props.ee.emit('zoomIn');
  }

  zoomOut() {
    this.props.ee.emit('zoomOut');
  }

  render() {
    let cursorStyle, splitStyle, dragStyle, selectStyle;

    if (this.props.toolMode === toolMode.CURSOR) {
      cursorStyle = selectColor;
    } else if (this.props.toolMode === toolMode.SPLIT) {
      splitStyle =  selectColor;
    } else if (this.props.toolMode === toolMode.DRAG) {
      dragStyle =  selectColor;
    } else if (this.props.toolMode === toolMode.SELECT) {
      selectStyle = selectColor;
    }

    return (
      <div className = {styles.tools} >
        <Toolbar >

          <ToolbarGroup firstChild={true} float="left">
            <ToolbarTitle text="Toolbar" />

              <IconButton onClick={this.setPlayingMode} tooltip="Play/Pause"> 
                {this.props.playing === playingMode.PLAYING ? <Pause /> : <Play />} 
              </IconButton>

              <IconButton onClick={this.stopPlaying} tooltip="Stop">
                <Stop />
              </IconButton>

              <IconButton onClick={this.changeToCursor} tooltip="Cursor">
                <LocationSearch color={cursorStyle}/>
              </IconButton>

              <IconButton onClick={this.changeToDrag} tooltip="Drag">
                <OpenWith color={dragStyle} />
              </IconButton>

              <IconButton onClick={this.changeToSplit} tooltip="Split">
                <Scissor color={splitStyle} />
              </IconButton>

              <IconButton onClick={this.changeToSelect} tooltip="Select">
                <Hand color={selectStyle} />
              </IconButton>

              <IconButton onClick={this.removeBlocks} tooltip="Delete">
                <Delete />
              </IconButton>

          </ToolbarGroup>

          <ToolbarGroup float="right">

            <IconButton onClick={this.zoomIn} tooltip="Zoom In!">
             <ActionZoomIn />
            </IconButton>

            <IconButton onClick={this.zoomOut} tooltip="Zoom Out!">
             <ActionZoomOut />
            </IconButton>

          </ToolbarGroup>

        </Toolbar>
      </div>
    )
  }
}

export default Tools;
