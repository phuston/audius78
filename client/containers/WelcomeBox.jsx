//Outside
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';
import * as rowActions from '../actions/rows.js'

//Components
import Welcome from '../components/Welcome/Welcome.jsx'

//Styling
import styles from './Containers.scss'

class WelcomeBox extends Component{

  constructor(props) {
    super(props);
    var dispatch = this.props.dispatch;

    setInterval(this.update.bind(this), 5000);

    //Bind Actions
    this.newWorkspace = () => dispatch(rowActions.newWorkspace());
    this.loadWorkspace = (workspaceId) => dispatch(rowActions.loadWorkspace(workspaceId));
  }

  onNewWorkspace(){
    this.newWorkspace()
  }

  render(){
    return (
      <div className={styles.welcome}>
        <h1>Welcome to Audius78</h1>
        <Welcome onNewWorkspace={this.onNewWorkspace}/>
      </div>
    )
  }
}

export default connect(x=>x)(WelcomeBox);
