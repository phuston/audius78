import React, { Component } from 'react';

import styles from './Tools.scss';

class Tools extends Component{

	render() {
		return (

			<div className = {styles.sidebar} >
				<input type='button' value='Split' className={styles.split} />
				<input type='button' value='Move' className={styles.move} />
			</div>
		)
	}
}

export default Tools;