// Outside
import React, { Component } from 'react';
import { connect } from 'react-redux';

//Containers
import Row from './AudioBlock.jsx'

//Styling 
import styles from './Containers.scss'


class Row extends Component{

	render(){
		return (

			<div className={styles.row}>
				<AudioBlock />
			</div>
		)
	}
}


export default Row;
