//Outside
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';


//Components
import NewWorkspace from '../components/NewWorkspace/NewWorkspace.jsx'
import ExistingWorkspace from '../components/ExistingWorkspace/ExistingWorkspace.jsx'

//Styling
import styles from './Containers.scss'

class Welcome extends Component{

	onNewWorkspace(){

		console.log("NEW WORKSPACE!");

	}

	render(){
		return (
			<div className={styles.welcome}>
				<h1>Welcome to Audius78</h1>
				<NewWorkspace 
				onNewWorkspace={this.onNewWorkspace}/>
				<ExistingWorkspace />
			</div>
		)
	}
}

export default connect(x=>x)(Welcome);
