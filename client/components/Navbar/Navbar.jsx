import React, { Component } from 'react';
import { Link } from 'react-router';

import styles from './Navbar.scss';


class Navbar extends Component{

	render() {
		return (

			<div className = {styles.navbar} >
				<h2> Audius78 Workspace</h2>
				<Link to='/'><input className={styles.button} type='button' value='Logout' /></Link>
			</div>
		)
	}
}

export default Navbar;