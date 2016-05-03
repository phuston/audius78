// Outside
import React, { Component } from 'react';
import { playingMode } from '../../../utils';

// Material
import Remove from 'material-ui/lib/svg-icons/content/remove-circle';
import IconButton from 'material-ui/lib/icon-button';

// Styling
import styles from './RowTool.scss';

class RowTool extends Component{
	constructor(props) {
		super(props);

		this.handleDeleteRow = this.handleDeleteRow.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
	}

	handleDeleteRow() {
		this.props.ee.emit('removeRow', this.props.row._id);
	}

  handleVolumeChange(e) {
    if (this.props.playing !== playingMode.PLAYING) {
      this.props.ee.emit('setRowGain', {
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

          <IconButton onClick={this.handleDeleteRow} tooltipPosition="top-center" tooltip="Remove Row">
              <Remove />
          </IconButton>

      </div>
    )
  }
}

export default RowTool;
