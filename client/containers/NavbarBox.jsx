// Outside
import React, { Component } from 'react';

// Styling
import styles from './Containers.scss';

// Components
import Navbar from '../components/Navbar/Navbar.jsx'

class NavbarBox extends Component{

  render() {
    return (

      <div className = {styles.navbar} >
        <Navbar />
      </div>
    )
  }
}

export default NavbarBox;
