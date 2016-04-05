import React, { Component } from 'react';

import styles from './ExistingWorkspace.scss';

class ExistingWorkspace extends Component{

	render() {
		return (
			<div className={styles.existingWorkspace} >
				<input 
					className={styles.existingInput}
					type='text' 
					placeholder='Enter Code' />
				<input 
					className={styles.existingButton}
					type='button' 
					value='Enter Existing Workspace' />
			</div>
		);
	}
}

export default ExistingWorkspace;