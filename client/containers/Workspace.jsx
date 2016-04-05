// Outside
import React, { Component } from 'react';
import { connect } from 'react-redux';

//Containers
import TrackBox from './TrackBox.jsx'

//Components
import Navbar from '../components/Navbar/Navbar.jsx'
import Sidebar from '../components/Sidebar/Sidebar.jsx'
import MasterTrack from '../components/MasterTrack/MasterTrack.jsx'

//Styling 
import styles from './Containers.scss'


class Workspace extends Component{

	render(){
		return (
			<div className={styles.workspace} >
				<h1> Welcome to the Workspace </h1>
				<Navbar className={styles.navbar}/>
				<Sidebar className={styles.sidebar}/>
				<MasterTrack className={styles.mastertrack}/>
				<TrackBox className={styles.trackbox}/>
			</div>
		)
	}
}


export default connect(x=>x)(Workspace);
