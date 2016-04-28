// Outside
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { playingMode, toolMode, UIConstants } from '../../utils.js';

// Styling 
import styles from './Containers.scss';

// Components
import Row from '../components/Row/Row.jsx';
import TimeRuler from '../components/TimeRuler/TimeRuler.jsx'

class Cursor extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let cursorStyle = {
      'position': 'absolute', 
      'top': '272px', 
      'left': this.props.styling.left + UIConstants.LEFT, 
      'width': '3px', 
      'background': 'rgba(182,184,1,0.5)', 
      'zIndex': '5', 
      'height': (UIConstants.ROW_HEIGHT+4) * (this.props.styling.numRows-1) + UIConstants.ROW_HEIGHT
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
      'top': '272px', 
      'left': this.props.styling.left + UIConstants.LEFT, 
      'width': '3px', 
      'background': 'rgba(255,255,255,0.7)', 
      'zIndex': '5', 
      'height': (UIConstants.ROW_HEIGHT+4) * (this.props.styling.numRows-1) + UIConstants.ROW_HEIGHT
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
    let splitOperation = {
      rowId: rowId,
      blockId: blockId,
      operation: {
        splitElement: splitElement
      }
    };
    this.props.socket.emit('splitBlock', splitOperation);
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
    };
    this.props.socket.emit('flagBlock', flagOperation);
  }

  emitMoveBlock(rowId, blockId, moveShift) {
    let moveOperation = {
      rowId: rowId,
      blockId: blockId,
      operation: {
        moveShift: moveShift
      }
    };
    this.props.socket.emit('moveBlock', moveOperation);
  }

  componentWillUpdate(nextProps, nextState) {
    let newSeeker = nextProps.workspace.timing.seeker;
    let oldSeeker = this.props.workspace.timing.seeker;

    // If the new seeker is at least 10px from where the current seeker is
    // tell Workspace component to update its AudioCtx time, and then set
    // seekedNew to true so this.drawTimescale knows to update new value during its animation
    if ( (newSeeker > oldSeeker+10 || newSeeker < oldSeeker-10) 
            && (this.props.workspace.playing === playingMode.PLAYING) ) {
      this.props.seekTime(newSeeker / this.props.workspace.timing.speed);
      this.seekedNew = true;
    }
  }

  drawTimescale(x) {
    // Animates the seeker across the screen. Stops on command.
    this.updating = true;

    if (this.seekedNew) {
      // If a different part of audio is seeked, use that value instead of the passed in parameter
      x = this.props.workspace.timing.seeker;
      this.seekedNew = false;
    }

    if (this.props.workspace.playing === playingMode.PLAYING) {
      // Only animate when audio is playing
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
            highlightBlock={this.props.highlightBlock}
            rowData={row} 
            currentZoom={this.props.workspace.zoomLevel}
            toolMode={this.props.workspace.toolMode}
            playing={this.props.workspace.playing}
            setCursor={this.props.setCursor}
            setSeeker={this.props.setSeeker}
            setSpeed={this.props.setSpeed}
            emitSplitBlock={this.emitSplitBlock}
            emitMoveBlock={this.emitMoveBlock}
            emitRemoveRow={this.props.emitRemoveRow}
            setWorkspaceWidth={this.props.setWorkspaceWidth}
            width={this.props.workspace.width}
          />
        );
	  	});
  	}

    if (this.props.workspace.playing === playingMode.PLAYING && this.updating === false) {
      this.drawTimescale(this.props.workspace.timing.seeker);
    }

    let trackboxStyle = {'height': this.props.workspace.rows.length * UIConstants.ROW_HEIGHT + 74};

    return (
      <div className={styles.trackbox} style={trackboxStyle}>
        <TimeRuler workspace={this.props.workspace}/>
        <Seeker styling={{left: this.props.workspace.timing.seeker, numRows: this.props.workspace.rows.length}}/>
        <Cursor styling={{left: this.props.workspace.timing.cursor, numRows: this.props.workspace.rows.length}}/>
        {rows}
      </div>
    )
  }
}


export default TrackBox;
