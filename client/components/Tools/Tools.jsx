import React, { Component } from 'react';
import { playingMode } from '../../../utils.js';

import styles from './Tools.scss';

class Tools extends Component{
  constructor(props) {
    super(props);

    this.togglePlaying = this.togglePlaying.bind(this);
  }

  togglePlaying( playingState ) {
    //this.props.togglePlaying(!this.props.playing);
    this.props.togglePlaying( playingState );
  }

  render() {
    return (
      <div className = {styles.tools} >
        <input type='button' 
          value={this.props.playing === playingMode.PLAYING ? 'Pause' : 'Play'} 
          className={styles.pauseplay} 
          onClick={this.togglePlaying(this.props.playing === playingMode.PLAYING ? playingMode.PAUSE : playingMode.PLAY)}/>
        <input type='button' value='Stop' className={styles.stop}
          onClick={this.togglePlaying(playingMode.STOP)} />
        <input type='button' value='Cut' className={styles.cut} />
        <input type='button' value='Move' className={styles.move} />
        <input type='button' value='Split' className={styles.split} />
      </div>
    )
  }
}

export default Tools;
