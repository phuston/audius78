// Outside
import React, { Component } from 'react';

// Styling 
import styles from './Containers.scss';

// Components
import Row from '../components/Row/Row.jsx';
import Time from '../components/Time/Time.jsx'


class TrackBox extends Component{

  render(){
    return (

      <div >
        <Time />
        <Row />
      </div>
    )
  }
}


export default TrackBox;
