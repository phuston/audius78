//Outside
import React, { Component } from 'react';
import { connect } from 'react-redux';

//Components
import NewWorkspace from '../components/NewWorkspace/NewWorkspace.jsx'
import ExistingWorkspace from '../components/ExistingWorkspace/ExistingWorkspace.jsx'

//Styling
import styles from './Containers.scss'


class Welcome extends Component{

	render(){
		return (
			<div className={styles.welcome}>
				<h1>Welcome to Audius78</h1>
				<NewWorkspace />
				<ExistingWorkspace />
			</div>
		)
	}
}


export default connect(x=>x)(Welcome);
