// Outside
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { playingMode, toolMode } from '../../utils.js';

// Styling 
import styles from './Containers.scss';

// Components
import Row from '../components/Row/Row.jsx';
import Time from '../components/Time/Time.jsx'

class Cursor extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let cursorStyle = {
      'position': 'absolute', 
      'top': '273px', 
      'left': this.props.styling.left + 88, 
      'width': '1px', 
      'background': 'red', 
      'zIndex': '5', 
      'height': this.props.styling.numRows * 110 // Change this to # of rows * 100px
    };
    return <div id='cursor' style={cursorStyle}/>;
  }
}

class Seeker extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let seekerStyle = {
      'position': 'absolute', 
      'top': '273px', 
      'left': this.props.styling.left + 88, 
      'width': '4px', 
      'border': '1px solid white', 
      'background': 'rgba(0,0,0,0.3)', 
      'zIndex': '5', 
      'height': this.props.styling.numRows * 110 // Change this to # of rows * 100px
    };
    return <div id='seeker' style={seekerStyle}/>;
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
    this.seekedNew = false;
	}

  emitSplitBlock(rowId, blockId, splitElement) {
    console.log("Emitting split operation");
    let splitOperation = {
      rowId: rowId,
      blockId: blockId,
      operation: {
        splitElement: splitElement
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

  componentWillUpdate(nextProps, nextState) {
    let newSeeker = nextProps.workspace.timing.seeker;
    let oldSeeker = this.props.workspace.timing.seeker;
    if ( (newSeeker > oldSeeker+10 || newSeeker < oldSeeker-10) 
            && (this.props.workspace.playing === playingMode.PLAYING) ) {
      this.props.seekTime(newSeeker / this.props.workspace.timing.speed);
      this.seekedNew = true;
    }
  }

  drawTimescale(x) {
    this.updating = true;
    if (this.seekedNew) {
      x = this.props.workspace.timing.seeker;
      this.seekedNew = false;
    }

    if (this.props.workspace.playing === playingMode.PLAYING) {
      let req = window.requestAnimationFrame(this.drawTimescale.bind(null, x + this.props.workspace.timing.speed/60));
      this.props.setSeeker(x);
    } else {
      this.updating = false;
    }
  }

  render() {
  	if (this.props.workspace.rows !== undefined) {
			var rows = Array.prototype.map.call(this.props.workspace.rows, (row) => {
	  		return (
          <Row key={row.rowId} 
            rowData={row} 
            currentZoom={this.props.workspace.zoomLevel}
            toolMode={this.props.workspace.toolMode}
            playing={this.props.workspace.playing}
            setCursor={this.props.setCursor}
            setSeeker={this.props.setSeeker}
            setSpeed={this.props.setSpeed}
            emitSplitBlock={this.emitSplitBlock}
          />
        );
	  	});
  	}

    if (this.props.workspace.playing === playingMode.PLAYING && this.updating === false) {
      this.drawTimescale(this.props.workspace.timing.seeker);
    }

    return (
      <div>
        <Time workspace={this.props.workspace}/>
        <Seeker styling={{left: this.props.workspace.timing.seeker, numRows: this.props.workspace.rows.length}}/>
        <Cursor styling={{left: this.props.workspace.timing.cursor, numRows: this.props.workspace.rows.length}}/>
        {rows}
      </div>
    )
  }
}


export default TrackBox;
