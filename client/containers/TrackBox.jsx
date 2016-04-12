// Outside
import React, { Component } from 'react';

// Styling 
import styles from './Containers.scss';

// Components
import Row from '../components/Row/Row.jsx';


class TrackBox extends Component{

	render(){
		return (

			<div >
				<h1> Tracks </h1>
				<Row />
				<Row />
			</div>
		)
	}
}


export default TrackBox;
