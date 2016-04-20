import React, { Component } from 'react';
import { Link } from 'react-router';

import * as workspaceActions from '../../actions/workspace.js'
import styles from './Welcome.scss';

class Welcome extends Component{
  constructor(props) {
    super(props);

    this.handleInputChange = (e) => this.workspaceId = e.target.value;

    let dispatch = this.props.dispatch;
    let audioCtx = new (window.AudioContext || window.webkitAudioContexet)();
    // dispatch(workspaceActions.audioContext(audioCtx));

    this.loadWorkspace = () => this.props.onLoadWorkspace(this.workspaceId, audioCtx);
    this.createWorkspace = () => this.props.onNewWorkspace(audioCtx);
  }

  render() {
    return (
      <div className={styles.existingWorkspace} >
        <input 
          className={styles.workspaceButton}
          type='button' 
          value='New Workspace' 
          onClick={this.createWorkspace}
        />

        <input
          id='workspaceId'
          className={styles.existingInput}
          type='text' 
          placeholder='Enter Code'
          onChange={this.handleInputChange} 
        />
        
        <input 
          className={styles.existingButton}
          type='button' 
          value='Enter Existing Workspace'
          onClick={this.loadWorkspace}
        />
      </div>
    );
  }
}

export default Welcome
