import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { playingMode, toolMode, UIConstants } from '../../../utils.js';

class Cursor extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
  	return (
  		nextProps.position !== this.props.position || 
  		nextProps.numRows !== this.props.numRows
  	);
  }

  render() {
    let cursorStyle = {
      'position': 'absolute', 
      'top': '243px', 
      'left': this.props.position + UIConstants.LEFT, 
      'width': '3px', 
      'background': 'rgba(240,0,0,0.5)', 
      'zIndex': '5', 
      'height': (UIConstants.ROW_HEIGHT+4) * (this.props.numRows-1) + UIConstants.ROW_HEIGHT + 29
    };
    return <div id='cursor' style={cursorStyle}/>;
  }
}

export default Cursor;