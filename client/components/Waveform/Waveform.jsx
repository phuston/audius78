// Outside
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Styling 
// import styles from './Waveform.scss'

// Others
import { playingMode, toolMode, UIConstants } from '../../../utils.js';

// Audio Processing
import extractPeaks from 'webaudio-peaks';

class Waveform extends Component {
  constructor(props) {
    super(props);

    this.draw = this.draw.bind(this);
    this.processProps = this.processProps.bind(this);
    this.needsToUpdate = this.needsToUpdate.bind(this);
    this.processProps(this.props); //this.props.currentZoom, this.props.block, this.props.rawAudio);
    this.handleCanvasClick = this.handleCanvasClick.bind(this);
    this.props.setSpeed(this.peaks.data[0].length/(2*this.props.rawAudio.duration));
  }

  needsToUpdate(oldProps, newProps) {
  	// New properties only need to be computed if a zoom event fires or a block changes.
  	return (
  		(oldProps.currentZoom !== newProps.currentZoom) ||
  		(oldProps.block.file_end !== newProps.block.file_end) ||
      (oldProps.block.row_offset !== newProps.block.row_offset) ||
      (oldProps.block._id !== newProps.block._id)
		);
  }

  processProps(props) {
  	// Set new peaks and starting and ending points of waveform block
    let zoom = props.currentZoom;
  	this.peaks = extractPeaks(props.rawAudio, 2000*zoom, true);
  	this.firstPeak = Math.floor(props.block.file_offset / zoom);
  	this.lastPeak = Math.ceil((props.block.file_end / zoom) || (this.peaks.data[0].length - 1));
  	this.width = this.peaks.data[0].slice(this.firstPeak, this.lastPeak).length/2 - 2;
  }

  componentWillReceiveProps(nextProps) {
  	// Need to pre-emptively update state so that component can render with correct width
  	if (this.needsToUpdate(this.props, nextProps)) {
    	this.processProps(nextProps);
  	}
  }

  componentDidUpdate(prevProps, prevState) {
  	// Only draw once the canvas has been rendered
    if (this.needsToUpdate(prevProps, this.props)) {
    	let ctx = ReactDOM.findDOMNode(this).getContext('2d');
      let rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
      this.left = rect.left + (window.pageXOffset || document.documentElement.scrollLeft || 0);
      this.props.setWorkspaceWidth(this.left + this.width + 100);
      this.draw(ctx);
      this.props.setSpeed(this.peaks.data[0].length/(2*this.props.rawAudio.duration));
    }
  }

  componentDidMount() {
    let ctx = ReactDOM.findDOMNode(this).getContext('2d');
    let rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
    this.left = rect.left + (window.pageXOffset || document.documentElement.scrollLeft || 0);
    this.props.setWorkspaceWidth(this.left + this.width + 100);
    this.draw(ctx);
  }

  handleCanvasClick(e) {
  	// Figure out which tool mode the workspace is in to apply the correct operation
    if (this.props.toolMode === toolMode.CURSOR) {
      if (this.props.playing === playingMode.PLAYING) {
        this.props.setSeeker(e.pageX - UIConstants.LEFT - 2);
      } else {
        this.props.setCursor(e.pageX - UIConstants.LEFT - 2);
      }
    } else if (this.props.playing !== playingMode.PLAYING) {
      if (this.props.toolMode === toolMode.SPLIT) {
        let distanceInWaveform = e.pageX - this.left + 5;
        let start = this.firstPeak * this.props.currentZoom;
        let end = this.lastPeak * this.props.currentZoom;

        let splitElement = Math.ceil((end - start) * (distanceInWaveform/this.width)) + start;
        if (splitElement > start+10 && splitElement < end-10) {
          this.props.emitSplitBlock(this.props.block._id, splitElement);
        }
      } else if (this.props.toolMode === toolMode.SELECT) {
        this.props.highlightBlock();
      }
    }
  }

  draw(ctx) {
  	// Draws the waveforms using peaks gotten from extractPeaks
    let peaks = this.peaks.data[0];
    let bits = this.peaks.bits;

    let i;
    let h2 = (UIConstants.ROW_HEIGHT - 4) / 2;

    let minPeak, min;
    let maxPeak, max;
    let x = 0;
    let maxValue = Math.pow(2, bits-1);

    ctx.save();
    ctx.fillStyle = '#0A381C';

    // Every two peaks fit into one pixel width: one from top and one from bottom border
    for (i=this.firstPeak+2; i < this.lastPeak-2; i+=2) {
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
    let borderColor = this.props.selected ? '2px solid #E8F149' : '2px solid white';
    return (
      <canvas width={this.width} height={UIConstants.ROW_HEIGHT-4}
        style={{'border': borderColor, 'borderRadius': '5px'}}
        onClick={this.handleCanvasClick}
      />
    );
  }
}

export default Waveform;