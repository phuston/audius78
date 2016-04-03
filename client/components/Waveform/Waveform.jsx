import React, { Component } from 'react';

import styles from './Waveform.scss';


class Waveform extends Component{

	render() {
		return (

			<div className = {styles.waveform} >
				<p> I am a Waveform! </p>
			</div>
		)
	}
}

export default Waveform;