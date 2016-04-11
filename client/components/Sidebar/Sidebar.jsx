import React, { Component } from 'react';

import styles from './Sidebar.scss';


class Sidebar extends Component{

	render() {
		return (

			<div className = {styles.sidebar} >
				<p> I am a Sidebar! </p>
				<input type='button' value='Split' className={styles.split} />
				<input type='button' value='Move' className={styles.move} />
			</div>
		)
	}
}

export default Sidebar;