import React, { Component } from 'react';
import { playingMode } from '../../../utils';

import styles from './RowTool.scss';

class RowTool extends Component{
	constructor(props) {
		super(props);

		this.handleDeleteRow = this.handleDeleteRow.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
	}

	handleDeleteRow() {
		this.props.emitRemoveRow(this.props.row._id);
	}

  handleVolumeChange(e) {
    if (this.props.playing !== playingMode.PLAYING) {
      this.props.emitChangeRowGain({
        rowId: this.props.row._id,
        gain: e.target.value
      });
    }
  }

  render() {
    return (
      <div className = {styles.rowtool} 
        style={{
          'marginTop': this.props.top, 
          'marginLeft': 10 + this.props.scrollX
        }}>
        <input type='range' 
          min='0' 
          max='2' 
          step='0.05'
          value={this.props.row.gain} 
          onChange={this.handleVolumeChange} 
          className={styles.mute} />
        <input type='button' 
          value='Delete' 
          className={styles.delete} 
          onClick={this.handleDeleteRow}/>
      </div>
    )
  }
}

export default RowTool;
