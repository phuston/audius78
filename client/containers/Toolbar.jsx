// Outside
import React, { Component } from 'react';

// Styling
import styles from './Containers.scss';

// Components
import Tools from '../components/Tools/Tools.jsx'


class Toolbar extends Component{

	render() {
		return (
			<div className = {styles.toolbar} >
				<h2> Toolbar </h2>
				<Tools />
			</div>
		)
	}
}

export default Toolbar;