//Outside
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';
import { routeActions } from 'redux-simple-router';
import * as workspaceActions from '../actions/workspace.js'
import RaisedButton from 'material-ui/lib/raised-button';

//Components
import Welcome from '../components/Welcome/Welcome.jsx'

//Styling
import styles from './Containers.scss'

class WelcomeBox extends Component {

  constructor(props) {
    super(props);
    let dispatch = this.props.dispatch;

    //Bind Actions
    this.newWorkspace = (audioCtx) => dispatch(workspaceActions.newWorkspace(audioCtx)).then(() => {
      dispatch(routeActions.push('/workspace'));
    });
    this.loadWorkspace = (workspaceId, audioCtx) => dispatch(workspaceActions.loadWorkspace(workspaceId, audioCtx)).then(() => {
      dispatch(routeActions.push('/workspace'));
    });
  }

  render(){
    return (
      <div className={styles.welcome}>
        <h1>Welcome to Audius78</h1>
        <RaisedButton label="Welcome" />
        <Welcome onNewWorkspace={this.newWorkspace} onLoadWorkspace={this.loadWorkspace}/>
      </div>
    )
  }
}

export default connect(x=>x)(WelcomeBox);
