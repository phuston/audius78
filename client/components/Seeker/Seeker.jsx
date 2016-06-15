// Outside
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { playingMode, toolMode, UIConstants } from '../../../utils.js';

class Seeker extends Component {
  constructor(props) {
    super(props);

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
      this.props.ee.emit('seekTime', newSeeker / this.props.speed);
    }
  }


  render() {
    let seekerStyle = {
      'position': 'absolute', 
      'top': '243px', 
      'left': this.props.position + UIConstants.LEFT + 1, 
      'width': '2px', 
      'background': 'rgba(0,0,0,0.7)', 
      'zIndex': '5', 
      'height': (UIConstants.ROW_HEIGHT+4) * (this.props.numRows-1) + UIConstants.ROW_HEIGHT + 29
    };
    return <div id='seeker' style={seekerStyle}/>;
  }
}

export default Seeker;