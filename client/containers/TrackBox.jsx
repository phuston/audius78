// Outside
import React, { Component } from 'react';
import { connect } from 'react-redux';

//Containers
import Row from './Row.jsx'

//Styling 
import styles from './Containers.scss'


class TrackBox extends Component{

	render(){
		return (

			<div >
				<h1> This heres a trackbox </h1>
				<Row />
			</div>
		)
	}
}


export default TrackBox;
