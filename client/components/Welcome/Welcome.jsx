import React, { Component } from 'react';
import { Link } from 'react-router';


import styles from './Welcome.scss';

class Welcome extends Component{

  render() {
    return (
      <div className={styles.existingWorkspace} >

        <Link to='/workspace'> 
        <input 
          className={styles.workspaceButton}
          type='button' 
          value='New Workspace' 
          onClick={this.props.onNewWorkspace}/>
        </Link>

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

export default Welcome