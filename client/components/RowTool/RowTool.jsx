import React, { Component } from 'react';

import styles from './RowTool.scss';

class RowTool extends Component{

  render() {
    return (
      <div className = {styles.rowtool} style={{'position': 'absolute', 'top': this.props.top}}>
        <input type='button' value='Filter' className={styles.filter} />
        <input type='button' value='Mute' className={styles.mute} />
      </div>
    )
  }
}

export default RowTool;
