import React, { Component } from 'react';

import styles from './Time.scss';


class Time extends Component{

    render() {
        return (

            <div className = {styles.time} >
                <p> this is a timer that runs across the screen</p>
            </div>
        )
    }
}

export default Time;