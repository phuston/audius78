import React, { Component } from 'react';
import { Link } from 'react-router';

import styles from './NewWorkspace.scss';

class NewWorkspace extends Component{

	render() {
		return (
			<Link to='/workspace'> 
			<input 
				className={styles.workspaceButton}
				type='button' 
				value='New Workspace' 
				onClick={this.props.onNewWorkspace}/>
			</Link>
		);
	}
}

export default NewWorkspace;