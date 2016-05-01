import React, { Component } from 'react';

import styles from './RowTool.scss';

class RowTool extends Component{
	constructor(props) {
		super(props);

		this.handleDeleteRow = this.handleDeleteRow.bind(this);
	}

	handleDeleteRow() {
		this.props.emitRemoveRow(this.props.rowData._id);
	}

  render() {
    return (
      <div className = {styles.rowtool} style={{'marginTop': this.props.top, 'marginLeft': 10 + this.props.scrollX}}>
        <input type='button' value='Filter' className={styles.filter} />
        <input type='button' value='Mute' className={styles.mute} />
        <input type='button' value='Delete' className={styles.delete} onClick={this.handleDeleteRow}/>
      </div>
    )
  }
}

export default RowTool;
