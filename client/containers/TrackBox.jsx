// Outside
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { playingMode, toolMode, UIConstants } from '../../utils.js';

// Styling 
import styles from './Containers.scss';

// Material
import Card from 'material-ui/lib/card/card';

// Components
import Row from '../components/Row/Row.jsx';

class TrackBox extends Component{
	constructor(props) {
		super(props);

    this.emitSplitBlock = this.emitSplitBlock.bind(this);
    this.emitFlagBlock = this.emitFlagBlock.bind(this);
    this.emitMoveBlock = this.emitMoveBlock.bind(this);
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

  render() {
    let rows;
  	if (this.props.workspace.rows) {
			rows = Array.prototype.map.call(this.props.workspace.rows, (row) => {
	  		return (
          <Card key={row.rowId}>
            <Row
              scrollX={this.props.workspace.scrollX}
              highlightBlock={this.props.highlightBlock}
              row={row} 
              currentZoom={this.props.workspace.zoomLevel}
              toolMode={this.props.workspace.toolMode}
              playing={this.props.workspace.playing}
              setCursor={this.props.setCursor}
              setSeeker={this.props.setSeeker}
              setSpeed={this.props.setSpeed}
              emitChangeRowGain={this.props.emitChangeRowGain}
              emitSplitBlock={this.emitSplitBlock}
              emitMoveBlock={this.emitMoveBlock}
              emitRemoveRow={this.props.emitRemoveRow}
              setWorkspaceWidth={this.props.setWorkspaceWidth}
              width={this.props.workspace.width} />
          </Card>
        );
	  	});
  	}

    let trackboxStyle = {
      'height': this.props.workspace.rows.length * (UIConstants.ROW_HEIGHT+4) + 70
    };

    return (
      <div className={styles.trackbox} style={trackboxStyle}>
        {rows}
      </div>
    )
  }
}


export default TrackBox;
