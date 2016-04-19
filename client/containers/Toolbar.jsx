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
        <h2> Toolbar </h2>
        <Tools togglePlaying={this.props.togglePlaying} 
          playing={this.props.playing}
          updateZoom={this.props.updateZoom}
          currentZoom={this.props.currentZoom}/>
      </div>
    )
  }
}

export default Toolbar;