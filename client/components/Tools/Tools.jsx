import React, { Component } from 'react';

import styles from './Tools.scss';

class Tools extends Component{

  render() {
    return (

      <div className = {styles.tools} >
        <input type='button' value='Pause' className={styles.pauseplay} />
        <input type='button' value='Stop' className={styles.stop} />
        <input type='button' value='Cut' className={styles.cut} />
        <input type='button' value='Move' className={styles.move} />
        <input type='button' value='Split' className={styles.split} />

      </div>
    )
  }
}

export default Tools;