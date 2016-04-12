// Outside
import React, { Component } from 'react';

// Components
import AudioBlock from '../AudioBlock/AudioBlock.jsx';

//Styling 
import styles from './Row.scss';


class Row extends Component{

	render(){
		return (
			<div className={styles.row} >
				<h2> Row </h2>
				<AudioBlock />
			</div>
		)
	}
}


export default Row;
