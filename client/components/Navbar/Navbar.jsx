import React, { Component } from 'react';
import { Link } from 'react-router';

import styles from './Navbar.scss';


class Navbar extends Component{

	render() {
		return (

			<div className = {styles.navbar} >

				<p> I am a Navbar! </p>
				<Link to='/'><input type='button' value='Logout' /></Link>

			</div>
		)
	}
}

export default Navbar;