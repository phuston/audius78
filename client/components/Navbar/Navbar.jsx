import React, { Component } from 'react';

import styles from './Navbar.scss';


class Navbar extends Component{

	render() {
		return (

			<div className = {styles.navbar} >

				<p> I am a Navbar! </p>

			</div>
		)
	}
}

export default Navbar;