import React, { Component } from 'react';

import styles from './Toolbar.scss';


class Toolbar extends Component{

	render() {
		return (

			<div className = {styles.toolbar} >
				<p> I am a Toolbar! </p>
			</div>
		)
	}
}

export default Toolbar;