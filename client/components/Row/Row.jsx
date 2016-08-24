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
  }

  render(){
    return (
      <div className={styles.row} >
        <RowTool 
          scrollX={this.props.scrollX}
          top={(this.props.row.rowId === 0 ? 13 : 4)}
          row={this.props.row} 
          playing={this.props.playing}
          ee={this.props.ee} />
        <AudioBlock row={this.props.row}
          speed={this.props.speed}
          toolMode={this.props.toolMode}
          playing={this.props.playing}
        	currentZoom={this.props.currentZoom}
          width={this.props.width}
          ee={this.props.ee} />
      </div>
    )
  }
}


export default Row;
