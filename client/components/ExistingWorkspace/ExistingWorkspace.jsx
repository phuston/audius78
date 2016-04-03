import React, { Component } from 'react';

import styles from './ExistingWorkspace.scss';

class ExistingWorkspace extends Component{

	render() {
		return (
			<div className={styles.existing-workspace}
				<input 
					className={styles.existing-workspace-input}
					type='text' 
					placeholder='Enter Code' />
				<input 
					className={styles.existing-workspace-button}
					type='button' 
					value='Enter Existing Workspace' />
			</div>
		);
	}
}

export default ExistingWorkspace;