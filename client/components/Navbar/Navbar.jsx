// Outside
import React, { Component } from 'react';
import { Link } from 'react-router';

// Material 
import AppBar from 'material-ui/lib/app-bar';
import FlatButton from 'material-ui/lib/flat-button';

// Styling
import styles from './Navbar.scss';

class Navbar extends Component{

  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;  
  }

  handleLogout() {
    this.props.ee.emit('logout');
  }

  render() {
    return (
      <div className = {styles.navbar} >
        <AppBar 
          title={<span style={styles.title}>Audius78 <span className={styles.code}>Workspace ID: {this.props.workspaceId}</span></span>}
          iconElementRight={<FlatButton label="Logout" className={styles.logout} onClick={this.handleLogout} />}
          showMenuIconButton={false} />
      </div>
    )
  }
}

export default Navbar;
