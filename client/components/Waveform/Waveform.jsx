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
    this.processProps(this.props.currentZoom);
    this.handleCanvasClick = this.handleCanvasClick.bind(this);
    this.props.setSpeed(this.peaks.data[0].length/(2*this.props.rawAudio.duration));
  }

  processProps(zoom) {
  	let block = this.props.block;
  	this.peaks = extractPeaks(this.props.rawAudio, 2000*zoom, true);
  	this.firstPeak = block.file_offset / zoom;
  	this.lastPeak = (block.file_end / zoom) || (this.peaks.data[0].length - 1);
  }

  componentWillReceiveProps(nextProps) {
  	if (nextProps.currentZoom !== this.props.currentZoom) {
    	this.processProps(nextProps.currentZoom);
  	}
  }

  componentDidUpdate(prevProps, prevState) {
    let ctx = ReactDOM.findDOMNode(this).getContext('2d');
    if (prevProps.currentZoom !== this.props.currentZoom) {
      this.draw(ctx);
      this.props.setSpeed(this.peaks.data[0].length/(2*this.props.rawAudio.duration));
    }
  }

  componentDidMount() {
    let ctx = ReactDOM.findDOMNode(this).getContext('2d');
    this.draw(ctx);
  }

  handleCanvasClick(e) {
    if (this.props.toolMode === toolMode.CURSOR) {
      if (this.props.playing === playingMode.PLAYING) {
        this.props.setSeeker(e.pageX-90);
      } else {
        this.props.setCursor(e.pageX-90);
      }
    } else if (this.props.toolMode === toolMode.SPLIT) {
      let splitElement = (e.pageX-90) * 2;
      this.props.emitSplitBlock(this.props.block._id, splitElement);
      // call emit socket
    } else if (this.props.toolMode === toolMode.DRAG) {
      console.log('drag');
    }
  }

  draw(ctx) {
    let peaks = this.peaks.data[0];
    let bits = this.peaks.bits;

    let i;
    let h2 = 50; // canvas.height / 2;

    let minPeak, min;
    let maxPeak, max;
    let x = 0;
    let maxValue = Math.pow(2, bits-1);

    ctx.save();
    ctx.fillStyle = '#000';

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
    let width = this.peaks.data[0].slice(this.firstPeak, this.lastPeak).length/2 - 2;
    return (
      <canvas width={width} height={100}
        style={{'border': '1px solid white'}}
        onClick={this.handleCanvasClick}
      />
    );
  }
}

export default Waveform;