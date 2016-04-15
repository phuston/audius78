import React, { Component } from 'react';
import { Link } from 'react-router';

import styles from './Welcome.scss';

class Welcome extends Component{
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.loadWorkspace = this.loadWorkspace.bind(this);
  }

  handleInputChange(e) {
    this.workspaceId = e.target.value;
  }

  loadWorkspace() {
    this.props.onLoadWorkspace(this.workspaceId);
  }

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
          id='workspaceId'
          className={styles.existingInput}
          type='text' 
          placeholder='Enter Code'
          onChange={this.handleInputChange} />
        
        <Link to='/workspace'>
        <input 
          className={styles.existingButton}
          type='button' 
          value='Enter Existing Workspace'
          onClick={this.loadWorkspace}
        />
        </Link>
      </div>
    );
  }
}

export default Welcome