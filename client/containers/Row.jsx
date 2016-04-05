// Outside
import React, { Component } from 'react';
import { connect } from 'react-redux';

//Containers
import AudioBlock from './AudioBlock.jsx'

//Styling 
import styles from './Containers.scss'


class Row extends Component{

	render(){
		return (
			<div className={styles.row} >
				<h2> I am the Row, yo! </h2>
				<AudioBlock />
			</div>
		)
	}
}


export default Row;
