// Outside
import React, { Component } from 'react';

// Styling
import styles from './Containers.scss';

// Components
import Tools from '../components/Tools/Tools.jsx'


class Toolbar extends Component{
	constructor(props) {
		super(props);
	}

  render() {
    return (
      <div className = {styles.toolbar}>
        <Tools setPlayingMode={this.props.setPlayingMode} 
          setToolMode={this.props.setToolMode}
          deleteSelected={this.props.deleteSelected}
          setZoom={this.props.setZoom}
          currentZoom={this.props.currentZoom}
          stopPlaying={this.props.stopPlaying}
          toolMode={this.props.toolMode}
          playing={this.props.playing}
          setSeeker={this.props.setSeeker}
          cursor={this.props.cursor}
        />
      </div>
    )
  }
}

export default Toolbar;
