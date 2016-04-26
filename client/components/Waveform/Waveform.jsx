// Outside
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Styling 
// import styles from './Waveform.scss'

// Others
import { playingMode, toolMode } from '../../../utils.js';

// Audio Processing
import extractPeaks from 'webaudio-peaks';

class Waveform extends Component {
  constructor(props) {
    super(props);

    this.draw = this.draw.bind(this);
    this.processProps = this.processProps.bind(this);
    this.needsToUpdate = this.needsToUpdate.bind(this);
    this.processProps(this.props.currentZoom, this.props.block);
    this.handleCanvasClick = this.handleCanvasClick.bind(this);
    this.props.setSpeed(this.peaks.data[0].length/(2*this.props.rawAudio.duration));
  }

  needsToUpdate(oldProps, newProps) {
  	// New properties only need to be computed if a zoom event fires 
  	// or a block changes.
  	return (
  		(oldProps.currentZoom !== newProps.currentZoom) ||
  		(oldProps.block.file_end !== newProps.block.file_end)
		);
  }

  processProps(zoom, block) {
  	// Set new peaks and starting and ending points of waveform block
  	this.peaks = extractPeaks(this.props.rawAudio, 2000*zoom, true);
  	this.firstPeak = Math.floor(block.file_offset / zoom);
  	this.lastPeak = Math.ceil((block.file_end / zoom) || (this.peaks.data[0].length - 1));
  	this.width = this.peaks.data[0].slice(this.firstPeak, this.lastPeak).length/2 - 2;
  	this.props.setWorkspaceWidth(this.width + block.row_offset);
  }

  componentWillReceiveProps(nextProps) {
  	// Need to pre-emptively update state so that component can render with correct width
  	if (this.needsToUpdate(this.props, nextProps)) {
    	this.processProps(nextProps.currentZoom, nextProps.block);
  	}
  }

  componentDidUpdate(prevProps, prevState) {
  	// Only draw once the canvas has been rendered
    if (this.needsToUpdate(prevProps, this.props)) {
    	let ctx = ReactDOM.findDOMNode(this).getContext('2d');
      this.draw(ctx);
      this.props.setSpeed(this.peaks.data[0].length/(2*this.props.rawAudio.duration));
    }
  }

  componentDidMount() {
    let ctx = ReactDOM.findDOMNode(this).getContext('2d');
    this.draw(ctx);
  }

  handleCanvasClick(e) {
  	// Figure out which tool mode the workspace is in to apply the correct operation
    if (this.props.toolMode === toolMode.CURSOR) {
      if (this.props.playing === playingMode.PLAYING) {
        this.props.setSeeker(e.pageX-90);
      } else {
        this.props.setCursor(e.pageX-90);
        console.log('start at', this.firstPeak, 'end at', this.lastPeak);
      }
    } else if (this.props.toolMode === toolMode.SPLIT) {
    	// e.pageX - 83 so that it is exactly where the dashed line on the cursor is
      let splitElement = Math.ceil(((e.pageX-85) * 2) * this.props.currentZoom);

      // Only accept splitting if it's +/- 5px from left or right border
      let start = this.firstPeak * this.props.currentZoom + 10;
      let end = this.lastPeak * this.props.currentZoom - 10;
      if (splitElement > start && splitElement < end) {
	      this.props.emitSplitBlock(this.props.block._id, splitElement);
      }
      
    } else if (this.props.toolMode === toolMode.DRAG) {
      console.log('drag');
    }
  }

  draw(ctx) {
  	// Draws the waveforms using peaks gotten from extractPeaks
    let peaks = this.peaks.data[0];
    let bits = this.peaks.bits;

    let i;
    let h2 = 50; // canvas.height / 2;

    let minPeak, min;
    let maxPeak, max;
    let x = 0;
    let maxValue = Math.pow(2, bits-1);

    ctx.save();
    ctx.fillStyle = '#fff';

    // Every two peaks fit into one pixel width: one from top and one from bottom border
    for (i=this.firstPeak+1; i < this.lastPeak-1; i+=2) {
      minPeak = peaks[i] / maxValue;
      maxPeak = peaks[i+1] / maxValue;

      min = Math.abs(minPeak * h2);
      max = Math.abs(maxPeak * h2);

      ctx.fillRect(x, 0, 1, h2-max);
      ctx.fillRect(x, h2+min, 1, h2-min);

      x += 1;
    }

    ctx.restore();
  }

  render() {
    return (
      <canvas width={this.width} height={100}
        style={{'border': '1px solid black'}}
        onClick={this.handleCanvasClick}
      />
    );
  }
}

export default Waveform;