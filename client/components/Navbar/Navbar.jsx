import React, { Component } from 'react';
import { Link } from 'react-router';

import styles from './Navbar.scss';


class Navbar extends Component{

  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className = {styles.navbar} >
        <h2> Audius78 Workspace</h2>
        <input className={styles.button} type='button' value='Logout' onClick={this.props.onLogout} />
      </div>
    )
  }
}

export default Navbar;
