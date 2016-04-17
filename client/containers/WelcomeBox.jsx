//Outside
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';
import * as workspaceActions from '../actions/workspace.js'

//Components
import Welcome from '../components/Welcome/Welcome.jsx'

//Styling
import styles from './Containers.scss'

class WelcomeBox extends Component {

  constructor(props) {
    super(props);
    var dispatch = this.props.dispatch;

    //Bind Actions
    this.newWorkspace = (audioCtx) => dispatch(workspaceActions.newWorkspace(audioCtx));
    this.loadWorkspace = (workspaceId, audioCtx) => dispatch(workspaceActions.loadWorkspace(workspaceId, audioCtx));
  }
  
  render(){
    return (
      <div className={styles.welcome}>
        <h1>Welcome to Audius78</h1>
        <Welcome onNewWorkspace={this.newWorkspace} onLoadWorkspace={this.loadWorkspace}/>
      </div>
    )
  }
}

export default connect(x=>x)(WelcomeBox);
