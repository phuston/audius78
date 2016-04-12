// Outside
import React, { Component } from 'react';

//Styling 
import styles from './AudioBlock.scss'


class AudioBlock extends Component{

	render(){
		return (

			<div className={styles.audioBlock}>
				<h3>Im the audioblock</h3>
			</div>
		)
	}
}


export default AudioBlock;
