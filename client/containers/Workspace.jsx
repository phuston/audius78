// Outside
import React, { Component } from 'react';
import { connect } from 'react-redux';

//Containers
import TrackBox from './TrackBox.jsx'
import Navbar from './NavbarBox.jsx'
import Sidebar from './Sidebar.jsx'

//Styling 
import styles from './Containers.scss'

class Workspace extends Component{

	render(){
		return (
			<div className={styles.page} >
				<Navbar className={styles.navbar}/>

				<div className={styles.workspace} >

					<Sidebar className={styles.sidebar}/>

					<div className={styles.songs}>
						<TrackBox className={styles.trackbox}/>
					</div>

				</div>
			</div>
		)
	}
}

export default Workspace;
