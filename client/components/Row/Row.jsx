// Outside
import React, { Component } from 'react';

// Components
import AudioBlock from '../AudioBlock/AudioBlock.jsx';
import RowTool from '../RowTool/RowTool.jsx';


//Styling 
import styles from './Row.scss';

class Row extends Component{

  render(){
    return (
      <div className={styles.row} >
        <RowTool />
        <AudioBlock data={this.props.rowData}/>
      </div>
    )
  }
}


export default Row;
