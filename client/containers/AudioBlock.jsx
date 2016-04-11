// Outside
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Components
import Waveform from '../components/Waveform/Waveform.jsx'
import Toolbar from '../components/Toolbar/Toolbar.jsx'

//Styling 
import styles from './Containers.scss'


class AudioBlock extends Component{

	render(){
		return (

			<div className={styles.audioBlock}>
				<h3> I am an AudioBlock </h3>
				<Waveform />
				<Toolbar />
			</div>
		)
	}
}


export default AudioBlock;
