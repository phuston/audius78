import React, { Component } from 'react';

import styles from './TimeRuler.scss';


class TimeRuler extends Component{

  render() {
    return (

      <div className = {styles.time} >
        <p> this is a timer that runs across the screen</p>
      </div>
    )
  }
}

export default TimeRuler;
