// Outside
import React, { Component } from 'react';
import { UIConstants } from '../../../utils';

// Components
import AudioBlock from '../AudioBlock/AudioBlock.jsx';
import RowTool from '../RowTool/RowTool.jsx';

//Styling 
import styles from './Row.scss';

class Row extends Component{

  constructor(props) {
    super(props);

    this.emitSplitBlock = this.emitSplitBlock.bind(this);
    this.emitMoveBlock = this.emitMoveBlock.bind(this);
    this.highlightBlock = this.highlightBlock.bind(this);
  }

  emitSplitBlock(blockId, splitElement) {
    this.props.emitSplitBlock(this.props.row._id, blockId, splitElement);
  }

  emitMoveBlock(blockId, moveShift) {
    this.props.emitMoveBlock(this.props.row._id, blockId, moveShift);
  }

  highlightBlock(blockIndex) {
    this.props.highlightBlock({
      blockIndex: blockIndex,
      rowIndex: this.props.row.rowId
    });
  }

  render(){
    return (
      <div className={styles.row} >
        <RowTool 
          scrollX={this.props.scrollX}
          top={(this.props.row.rowId === 0 ? 13 : 5)}
          row={this.props.row}
          emitRemoveRow={this.props.emitRemoveRow}
          emitChangeRowGain={this.props.emitChangeRowGain}
          playing={this.props.playing}
        />
        <AudioBlock row={this.props.row} 
          emitSplitBlock={this.emitSplitBlock}
          emitMoveBlock={this.emitMoveBlock}
          highlightBlock={this.highlightBlock}
          toolMode={this.props.toolMode}
          playing={this.props.playing}
        	currentZoom={this.props.currentZoom}
        	setCursor={this.props.setCursor}
        	setSeeker={this.props.setSeeker}
          setSpeed={this.props.setSpeed}
          setWorkspaceWidth={this.props.setWorkspaceWidth}
          width={this.props.width}
        />
      </div>
    )
  }
}


export default Row;
