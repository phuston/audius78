// Outside
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Others
import { flagType, UIConstants } from '../../../utils.js';
import { logarithmic } from 'fade-curves';

class FadeCanvas extends Component {
	constructor(props) {
		super(props);

		this.processProps = this.processProps.bind(this);
		this.update = this.update.bind(this);
		this.draw = this.draw.bind(this);

		this.processProps(this.props);
	}

	shouldComponentUpdate(nextProps, nextState) {
	 	return (
	 		this.props.currentZoom !== nextProps.currentZoom
 		);     
	}

	componentWillUpdate(nextProps, nextState) {
	 	this.processProps(nextProps);     
	}

	componentDidUpdate(prevProps, prevState) {
	 	this.update();     
	}

	componentDidMount() {
	 	this.update(); 
	}

	update() {
		const ctx = ReactDOM.findDOMNode(this).getContext('2d'),
					rect = ReactDOM.findDOMNode(this).getBoundingClientRect();

		this.draw(ctx);
	}

	draw(ctx) {
		let curve, i, y,
			height = (UIConstants.ROW_HEIGHT - 4);

		ctx.strokeStyle = "black";

    y = height - this.curve[0] * height;
    ctx.beginPath();
    ctx.moveTo(0, y);

    for (i = 3; i < this.curve.length; i++) {
        y = height - this.curve[i] * height;
        ctx.lineTo(i, y);
    }

    ctx.stroke();
	}

	processProps(props) {
		const zoom = props.currentZoom,
			reflection = (props.fade.type === flagType.FADEIN) ? 1 : -1,
			begin = props.fade.start, // modify with zoom
			end = props.fade.end; // modify with zoom

		this.width = (end - begin) / 2;
		this.curve = logarithmic(this.width, 10, reflection);
	}

	render() {
		return (
			<canvas width={this.width} height={UIConstants.ROW_HEIGHT-4}
				style={{
					'borderRadius': '5px',
					'left': '2px',
					'top': '2px',
					'zIndex': '4',
					'position': 'absolute',
					'backgroundColor': 'rgba(0,0,0,0.1)'
				}}
			/>
		);	
	}
}

export default FadeCanvas;
