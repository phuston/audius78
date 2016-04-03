import React, { Component } from 'react';

import styles from './Sidebar.scss';


class Sidebar extends Component{

	render() {
		return (

			<div className = {styles.sidebar} >

				<input className={styles.split} />
				<input className={styles.move} />

			</div>
		)
	}
}

export default Sidebar;