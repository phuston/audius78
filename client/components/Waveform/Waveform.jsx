// Outside
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Material
import Card from 'material-ui/lib/card/card';

// Others
import { playingMode, toolMode, UIConstants } from '../../../utils.js';

// Audio Processing
import extractPeaks from 'webaudio-peaks';

class Waveform extends Component {
  constructor(props) {
    super(props);

    this.draw = this.draw.bind(this);
    this.processProps = this.processProps.bind(this);
    this.handleCanvasClick = this.handleCanvasClick.bind(this);

    this.processProps(this.props);
  }

  shouldComponentUpdate(nextProps, nextState) {
  	// New properties only need to be computed if a zoom event fires or a block changes.
  	return (
  		this.props.currentZoom !== nextProps.currentZoom ||
  		this.props.block.file_end !== nextProps.block.file_end ||
      this.props.block.row_offset !== nextProps.block.row_offset ||
      this.props.block._id !== nextProps.block._id ||
      this.props.selected !== nextProps.selected
		);
  }

  componentWillUpdate(nextProps, nextState) {
    this.processProps(nextProps);  
  }

  processProps(props) {
  	// Set new peaks and starting and ending points of waveform block
    const zoom = props.currentZoom;

  	this.peaks = extractPeaks(props.row.rawAudio, 2000*zoom, true);
  	this.firstPeak = Math.floor(props.block.file_offset / zoom);
  	this.lastPeak = Math.ceil((props.block.file_end / zoom) || (this.peaks.data[0].length - 1));
  	this.width = this.peaks.data[0].slice(this.firstPeak, this.lastPeak).length/2 - 2;
    this.props.ee.emit('setSpeed', this.peaks.data[0].length/(2*this.props.row.rawAudio.duration));
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

    this.left = rect.left + (window.pageXOffset || document.documentElement.scrollLeft || 0);
    this.props.ee.emit('setWidth', this.left + (this.peaks.data[0].length/2) + 100);
    
    this.draw(ctx);
  }

  handleCanvasClick(e) {
  	// Figure out which tool mode the workspace is in to apply the correct operation
    switch (this.props.toolMode) {
      case toolMode.CURSOR:
        if (this.props.playing === playingMode.PLAYING)
          this.props.ee.emit('setSeeker', e.pageX - UIConstants.LEFT - 2);
        else
          this.props.ee.emit('setCursor', e.pageX - UIConstants.LEFT - 2);
        break;

      case toolMode.SPLIT:
        // Do some math to work out where to split
        const distanceInWaveform = e.pageX - this.left + 4;
        const start = this.firstPeak * this.props.currentZoom;
        const end = this.lastPeak * this.props.currentZoom;
        const splitElement = Math.ceil((end - start) * (distanceInWaveform/this.width)) + start;
        
        if (splitElement > start+10 && splitElement < end-10)
          this.props.ee.emit('splitBlock', this.props.row._id, this.props.block._id, splitElement);
        break;

      case toolMode.SELECT:
        this.props.ee.emit('highlightBlock', this.props.blockIndex, this.props.row.rowId);
        break;
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
    ctx.fillStyle = "rgba(0, 131, 143, 0.8)";

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

    ctx.fillStyle = '#fff';
    ctx.font = '10px Arial';
    ctx.fillText(this.props.row.name, 5, 11, 100);

    ctx.restore();
  }

  render() {
    let borderColor = this.props.selected ? '2px solid black' : '2px solid #bbb';
    return (
      <canvas width={this.width} height={UIConstants.ROW_HEIGHT-4}
        style={{
          'position': 'absolute',
          'border': borderColor, 
          'borderRadius': '5px', 
          'boxShadow' : '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
        }}
        onClick={this.handleCanvasClick} />
    );
  }
}

export default Waveform;
