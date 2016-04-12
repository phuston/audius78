// Outside
import React, { Component } from 'react';

// Styling
import styles from './Containers.scss';

// Components
import Tools from '../components/Tools/Tools.jsx'


class Sidebar extends Component{

	render() {
		return (
			<div className = {styles.sidebar} >
				<Tools />
			</div>
		)
	}
}

export default Sidebar;