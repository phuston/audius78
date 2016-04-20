// Outside
import React, { Component } from 'react';

// Styling 
import styles from './Containers.scss';

// Components
import Row from '../components/Row/Row.jsx';
import Time from '../components/Time/Time.jsx'

class TrackBox extends Component{
	constructor(props) {
		super(props);
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

  render(){
  	if (this.props.workspace.rows !== undefined) {
			var rows = Array.prototype.map.call(this.props.workspace.rows, (row) => {
	  		return (<Row key={row.rowId} rowData={row} />);
	  	});
  	}

    return (
      <div>
        <Time workspace={this.props.workspace} />
        {rows}
      </div>
    )
  }
}


export default TrackBox;
