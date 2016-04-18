import React, { Component } from 'react';
import { playingMode } from '../../../utils.js';

import styles from './Tools.scss';

class Tools extends Component{
  constructor(props) {
    super(props);

    this.togglePlaying = this.togglePlaying.bind(this);
    this.stopPlaying = this.stopPlaying.bind(this);
  }

  togglePlaying() {
    if( this.props.playing === playingMode.PLAYING ){
      this.props.togglePlaying(playingMode.PAUSE);
    } else {
      this.props.togglePlaying(playingMode.PLAYING);
    }
  }

  stopPlaying(){
    this.props.stopPlaying();
  }

  render() {
    return (
      <div className = {styles.tools} >
        <input type='button' 
          value={this.props.playing === playingMode.PLAYING ? 'Pause' : 'Play'} 
          className={styles.pauseplay} 
          onClick={this.togglePlaying}/>
        <input type='button' value='Stop' className={styles.stop}
          onClick={this.stopPlaying} />
        <input type='button' value='Cut' className={styles.cut} />
        <input type='button' value='Move' className={styles.move} />
        <input type='button' value='Split' className={styles.split} />
      </div>
    )
  }
}

export default Tools;
