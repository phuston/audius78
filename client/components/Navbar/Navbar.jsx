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

  }

  render() {
    return (
      <div className = {styles.navbar} >
      <AppBar 
        title={<span style={styles.title}>Audius78</span>}
        iconElementRight={<FlatButton label="Logout" onClick={this.props.onLogout}/>}/>
      </div>
    )
  }
}

export default Navbar;
