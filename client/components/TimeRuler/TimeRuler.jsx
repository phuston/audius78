// Outside
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Styling
import styles from './TimeRuler.scss';


class TimeRuler extends Component{

	constructor(props) {
		super(props);

		this.draw = this.draw.bind(this);

		// Keeps track of how many seconds per big tick, medium tick and small tick for each zoom level
		this.tickInfo = {
			4: {
				fullTick: 10,
				halfTick: 5,
				smallTick: 1
			}, 
			2: {
				fullTick: 5,
				halfTick: 1,
				smallTick: 1
			},
			1: {
				fullTick: 5,
				halfTick: 1,
				smallTick: 0.5
			},
			0.5: {
				fullTick: 2,
				halfTick: 1,
				smallTick: 0.2
			}
		};

		this.tickHeight = {
			fullTick: 15,
			halfTick: 9,
			smallTick: 5
		};

		this.height = 48;
		this.leftMargin = 80;
	}

	// Converts a given time in seconds to the '00:00' display
	getDisplayTime(time) {
		if (time < 10) {
			return '00:0' + time;
		} else if (time < 60) {
			return '00:' + time;
		} else {
			let minutes = Math.floor(time / 60);
			let seconds = time % (minutes * 60);
			if (seconds < 10) seconds = '0' + seconds;
			if (minutes < 10) minutes = '0' + minutes;

			return minutes + ':' + seconds;
		}
	}

	componentDidUpdate(prevProps, prevState) {
		let ctx = ReactDOM.findDOMNode(this).getContext('2d');
		this.draw(ctx);
	}

	draw(ctx) {
		ctx.save();
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.clearRect(0, 0, this.props.workspace.width, 48);

    let tickInfo = this.tickInfo[this.props.workspace.zoomLevel];
    let length = this.props.workspace.width - 150;

    let numTicks = 0;
    let inc = this.props.workspace.timing.speed * (tickInfo.smallTick || tickInfo.halfTick);

    // For every tick, decide if it's a full, medium or small tick, and draw accordingly.
    // If fullTick, add a time label
    for (let i=0; i < length; i+=inc) {
    	if (numTicks % tickInfo.fullTick === 0) {
    		ctx.fillRect(i, this.height - this.tickHeight.fullTick, 1, this.tickHeight.fullTick);
    		ctx.fillText(this.getDisplayTime(numTicks), i, 28, 40);
    	} else if (numTicks % tickInfo.halfTick === 0) {
    		ctx.fillRect(i, this.height - this.tickHeight.halfTick, 1, this.tickHeight.halfTick);
    	} else {
    		ctx.fillRect(i, this.height - this.tickHeight.smallTick, 1, this.tickHeight.smallTick);
    	}
    	numTicks = parseFloat( (numTicks + tickInfo.smallTick).toFixed(1) );
    }

    ctx.restore();
	}

	render() {
		return (<canvas width={this.props.workspace.width} height={this.height} style={{'marginLeft': this.leftMargin}}/>);
	}
}

class TimeRulerWrapper extends Component {
  render() {
    return (
    	<div className={styles.time}>
    		<TimeRuler workspace={this.props.workspace}/>
    	</div>
    );
  }
}

export default TimeRulerWrapper;
