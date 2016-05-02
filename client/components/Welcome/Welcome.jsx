// Outside
import React, { Component } from 'react';
import { Link } from 'react-router';

// Actions
import * as workspaceActions from '../../actions/workspace.js'

// Styling
import styles from './Welcome.scss';

// Material
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';



class Welcome extends Component{
  constructor(props) {
    super(props);

    this.handleInputChange = (e) => this.workspaceId = e.target.value;

    let audioCtx = new (window.AudioContext || window.webkitAudioContexet)();

    this.loadWorkspace = () => this.props.onLoadWorkspace(this.workspaceId, audioCtx);
    this.createWorkspace = () => this.props.onNewWorkspace(audioCtx);
  }

  render() {
    return (
      <div className={styles.existingWorkspace} >
        <div className={styles.newButton} >
          <RaisedButton 
            label={'New Workspace'}
            onClick={this.createWorkspace}
            secondary={true}/>
        </div>

        <div className={styles.enterCode} >
          <TextField
             hintText="enter code"
             onChange={this.handleInputChange} 
             underlineShow={true} />
          <RaisedButton
            label={'Load Workspace'}
            onClick={this.loadWorkspace}
            primary={true} />
        </div>
      </div>
    );
  }
}

export default Welcome