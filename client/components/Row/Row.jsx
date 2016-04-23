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
  }

  emitSplitBlock(blockId, splitElement) {
    this.props.emitSplitBlock(this.props.rowData._id, blockId, splitElement);
  }

  render(){
    return (
      <div className={styles.row} >
        <RowTool />
        <AudioBlock data={this.props.rowData} 
          emitSplitBlock={this.emitSplitBlock}
          toolMode={this.props.toolMode}
          playing={this.props.playing}
        	currentZoom={this.props.currentZoom}
        	setCursor={this.props.setCursor}
        	setSeeker={this.props.setSeeker}
          setSpeed={this.props.setSpeed}/>
      </div>
    )
  }
}


export default Row;
