// Outside
import React, { Component } from 'react';

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
  }

  emitSplitBlock(blockId, splitElement) {
    this.props.emitSplitBlock(this.props.rowData._id, blockId, splitElement);
  }

  emitMoveBlock(blockId, moveShift) {
    this.props.emitMoveBlock(this.props.rowData._id, blockId, moveShift);
  }

  render(){
    return (
      <div className={styles.row} >
        <RowTool top={this.props.rowData.rowId * 104 + 272}/>
        <AudioBlock data={this.props.rowData} 
          emitSplitBlock={this.emitSplitBlock}
          emitMoveBlock={this.emitMoveBlock}
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
