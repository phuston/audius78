// Outside
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { playingMode } from '../../utils.js';

// Styling 
import styles from './Containers.scss';

// Components
import Row from '../components/Row/Row.jsx';
import Time from '../components/Time/Time.jsx'


class Seeker extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let seekerStyle = {
      'position': 'absolute', 
      'top': '273px', 
      'left': this.props.left, 
      'width': '4px', 
      'border': '1px solid white', 
      'background': 'rgba(0,0,0,0.3)', 
      'zIndex': '5', 
      'height': '100px'
    };
    return <div id='seeker' style={seekerStyle}/>
  }
}

class TrackBox extends Component{
	constructor(props) {
		super(props);

    this.drawTimescale = this.drawTimescale.bind(this);
    this.emitSplitBlock = this.emitSplitBlock.bind(this);
    this.emitFlagBlock = this.emitFlagBlock.bind(this);
    this.emitMoveBlock = this.emitMoveBlock.bind(this);
    this.updating = false;
	}

  emitSplitBlock(rowId, blockId, splitTime) {
    console.log("Emitting split operation");
    let splitOperation = {
      rowId: rowId,
      blockId: blockId,
      operation: {
        splitTime: splitTime
      }
    }
    this.props.socket.emit('splitBlock', splitOperation)
  }

  emitFlagBlock(rowId, blockId, flagType, startTime, duration) {
    console.log("Emitting flag operation");
    let flagOperation = {
      rowId: rowId,
      blockId: blockId,
      operation: {
        type: flagType,
        startTime: startTime,
        duration: duration
      }
    }
    this.props.socket.emit('flagBlock', flagOperation)
  }

  emitMoveBlock(rowId, blockId, moveShift) {
    console.log("Emitting move operation");
    let moveOperation = {
      rowId: rowId,
      blockId: blockId,
      operation: {
        moveShift: moveShift
      }
    }
    this.props.socket.emit('moveBlock', moveOperation)
  }


  componentDidUpdate(prevProps, prevState) {
    let audio = this.props.workspace.rows[0].rawAudio;
    let zoom = this.props.workspace.zoomLevel;
    console.log('raw length', Math.ceil(audio.length / (zoom*2000))/audio.duration);
    console.log('new method', 44100 / (this.props.workspace.zoomLevel * 2000));
    this.pixPerSec = 44100 / (this.props.workspace.zoomLevel * 2000);
  }

  drawTimescale(x) {
    this.updating = true;
    if (this.props.workspace.playing === playingMode.PLAYING) {
      let req = window.requestAnimationFrame(this.drawTimescale.bind(null, x + this.pixPerSec/50));
      this.props.updateTimescale(x);
    } else {
      this.updating = false;
    }
  }

  render() {
  	if (this.props.workspace.rows !== undefined) {
			var rows = Array.prototype.map.call(this.props.workspace.rows, (row) => {
	  		return (<Row key={row.rowId} rowData={row} currentZoom={this.props.workspace.zoomLevel}/>);
	  	});
  	}

    if (this.props.workspace.playing === playingMode.PLAYING && this.updating === false) {
      this.drawTimescale(this.props.workspace.left);
    }

    return (
      <div>
        <Time workspace={this.props.workspace}/>
        <Seeker left={this.props.workspace.left}/>
        {rows}
      </div>
    )
  }
}


export default TrackBox;
