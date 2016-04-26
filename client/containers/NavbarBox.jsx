//Outside
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';
import { routeActions } from 'redux-simple-router';
import * as workspaceActions from '../actions/workspace.js'
import { playingMode, toolMode } from '../../utils';

// Components
import Navbar from '../components/Navbar/Navbar.jsx'

//Styling
import styles from './Containers.scss'

class NavbarBox extends Component{

	constructor(props) {
    super(props);
    let dispatch = this.props.dispatch;

    this.logout = this.logout.bind(this);

    // Bind actions
		this.reroute = () => dispatch(routeActions.push('/'));
    this.clearRows = () => dispatch(workspaceActions.clearRows());
    this.resetPlayingMode = () => dispatch(workspaceActions.setPlayingMode(playingMode.STOP));
    this.resetToolMode = () => dispatch(workspaceActions.setToolMode(toolMode.CURSOR));
		this.resetSeeker = () => dispatch(workspaceActions.setSeeker(0));
		this.resetZoom = () => dispatch(workspaceActions.setZoom(1));
		this.resetCursor = () => dispatch(workspaceActions.setCursor(0));
		this.resetWorkspaceWidth = () => dispatch(workspaceActions.setWorkspaceWidth('100vw'));
  }

  logout () {
  	this.clearRows();
  	this.resetPlayingMode();
  	this.resetToolMode();
  	this.resetSeeker();
  	this.resetZoom();
  	this.resetCursor();
  	this.resetWorkspaceWidth();
  	this.reroute();
  }

  render() {
    return (
      <div className = {styles.navbar} >
        <Navbar onLogout={this.logout} />
      </div>
    )
  }
}

export default connect(x=>x)(NavbarBox);
