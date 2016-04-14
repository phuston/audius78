//Outside
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';


//Components
import Welcome from '../components/Welcome/Welcome.jsx'

//Styling
import styles from './Containers.scss'

class WelcomeBox extends Component{

    onNewWorkspace(){
        console.log("NEW WORKSPACE!");
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
