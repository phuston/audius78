import React, { Component } from 'react';

import styles from './NewWorkspace.scss';

class NewWorkspace extends Component{

	render() {
		return (
			<input 
				className={styles.workspaceButton}
				type='button' 
				value='New Workspace' />
		);
	}
}

export default NewWorkspace;