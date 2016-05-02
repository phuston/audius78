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
    this.props.ee.emit('splitBlock', this.props.row._id, blockId, splitElement);
  }

  emitMoveBlock(blockId, moveShift) {
    this.props.ee.emit('moveBlock', this.props.row._id, blockId, moveShift);
  }

  highlightBlock(blockIndex) {
    this.props.ee.emit('highlightBlock', {
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
          playing={this.props.playing}
          ee={this.props.ee}
        />
        <AudioBlock row={this.props.row} 
          emitSplitBlock={this.emitSplitBlock}
          emitMoveBlock={this.emitMoveBlock}
          highlightBlock={this.highlightBlock}
          toolMode={this.props.toolMode}
          playing={this.props.playing}
        	currentZoom={this.props.currentZoom}
          width={this.props.width}
          ee={this.props.ee}
        />
      </div>
    )
  }
}


export default Row;
