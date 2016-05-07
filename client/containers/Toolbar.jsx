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

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.playing !== this.props.playing ||
      nextProps.toolMode !== this.props.toolMode
    );
  }

  render() {
    return (
      <div className = {styles.toolbar}>
        <Tools toolMode={this.props.toolMode}
          playing={this.props.playing}
          cursor={this.props.cursor}
          ee={this.props.ee} />
      </div>
    );
  }
}

export default Toolbar;
