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
	 		this.props.zoom !== nextProps.zoom ||
	 		this.props.fade.end !== nextProps.fade.end ||
	 		this.props.fade.start !== nextProps.fade.start
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

		ctx.save();
		ctx.strokeStyle = "black";

    y = (1 - this.curve[0]) * height;
    ctx.beginPath();
    ctx.moveTo(0, y);

    for (i = 1; i < this.curve.length; i++) {
        y = (1 - this.curve[i]) * height;
        ctx.lineTo(i, y);
    }

    ctx.stroke();
	}

	processProps(props) {
		const zoom = props.currentZoom,
			begin = props.fade.start / props.zoom,
			end = props.fade.end / props.zoom;

		this.width = end - begin;
		this.curve = logarithmic(this.width, 10, 1);
		if (props.fade.type === flagType.FADEOUT) this.curve.reverse();
	}

	render() {
		return (
			<canvas width={this.width} height={UIConstants.ROW_HEIGHT-4}
				style={{
					'borderRadius': '5px',
					'left': this.props.fade.start / this.props.zoom + 2,
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
