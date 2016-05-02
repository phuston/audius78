// Outside
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { playingMode, toolMode, UIConstants } from '../../../utils.js';

class Seeker extends Component {
  constructor(props) {
    super(props);

    this.drawTimescale = this.drawTimescale.bind(this);
    this.animationInProgress = false;
    this.seekedNew = false;
  }

  shouldComponentUpdate(nextProps, nextState) {
  	return (
  		nextProps.position !== this.props.position || 
  		nextProps.numRows !== this.props.numRows ||
  		nextProps.playing !== this.props.playing
  	);
  }

  componentWillUpdate(nextProps, nextState) {
    let newSeeker = nextProps.position;
    let oldSeeker = this.props.position;

    // If the new seeker is at least 10px from where the current seeker is
    // tell Workspace component to update its AudioCtx time, and then set
    // seekedNew to true so this.drawTimescale knows to update new value during its animation
    if ( (newSeeker > oldSeeker+10 || newSeeker < oldSeeker-10) 
            && (this.props.playing === playingMode.PLAYING) ) {
      this.props.seekTime(newSeeker / this.props.speed);
      this.seekedNew = true;
    }
  }

  drawTimescale(x) {
    // Animates the seeker across the screen. Stops on command.
    this.animationInProgress = true;

    if (this.seekedNew) {
      // If a different part of audio is seeked, use that value instead of the passed in parameter
      x = this.props.position;
      this.seekedNew = false;
    }

    if (this.props.playing === playingMode.PLAYING) {
      // Only animate when audio is playing
      let req = window.requestAnimationFrame(this.drawTimescale.bind(null, x + this.props.speed/60));
      this.props.setSeeker(x);
    } else {
      this.animationInProgress = false;
    }
  }

  render() {

  	// If 
  	if (this.props.playing === playingMode.PLAYING && !this.animationInProgress) {
      this.drawTimescale(this.props.position);
    }

    let seekerStyle = {
      'position': 'absolute', 
      'top': '243px', 
      'left': this.props.position + UIConstants.LEFT, 
      'width': '3px', 
      'background': 'rgba(0,0,0,0.7)', 
      'zIndex': '5', 
      'height': (UIConstants.ROW_HEIGHT+4) * (this.props.numRows-1) + UIConstants.ROW_HEIGHT + 29
    };
    return <div id='seeker' style={seekerStyle}/>;
  }
}

export default Seeker;