// Outside
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

//Styling 
import styles from './AudioBlock.scss'

// Audio Processing
import extractPeaks from 'webaudio-peaks';

class Waveform extends Component {
  constructor(props) {
    super(props);

    this.draw = this.draw.bind(this);
  }

  componentDidMount() {
    let ctx = ReactDOM.findDOMNode(this).getContext('2d');
    this.draw(ctx);
  }

  draw(ctx) {
    let peaks = this.props.peaks.data[0];
    let bits = this.props.peaks.bits;
    let offset = this.props.block.row_offset;

    let i;
    let length = peaks.length/2;
    let h2 = 50; // canvas.height / 2;

    let minPeak, min;
    let maxPeak, max;
    let x = 0;
    let maxValue = Math.pow(2, bits-1);

    ctx.save();
    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#fff';

    for (i=0; i < length; i++) {
      minPeak = peaks[(i+offset)*2] / maxValue;
      maxPeak = peaks[(i+offset)*2+1] / maxValue;

      min = Math.abs(minPeak * h2);
      max = Math.abs(maxPeak * h2);

      ctx.fillRect(x, 0, 1, h2-max);
      ctx.fillRect(x, h2+min, 1, h2-min);

      x += 1;
    }

    ctx.restore();
  }

  render() {
    let width = this.props.peaks.data[0].length/2;
    return <canvas width={width} height={100}/>;
  }
}


class AudioBlock extends Component {
	constructor(props) {
		super(props);
    this.left = 84;
	}

  render(){
  	let data = this.props.data;

  	let waveforms = data.audioBlocks.map((block, i) => {
  		let start = block.file_offset;
  		let refValue = 'canvas'+i;
  		let context = null;

  		return (
  			<div key={i} height={100} style={{'border': 'none'}}>
  				<Waveform block={block} peaks={extractPeaks(this.props.data.rawAudio, 1000, true)}/>
  			</div>
			);
  	});

    return (
      <div className={styles.audioBlock}>
        <div id='seeker' style={{'position': 'absolute', 'top': '273px', 'left': this.left, 'width': '4px', 'border': '1px solid white', 'background': 'rgba(0,0,0,0.3)', 'zIndex': '5', 'height': '100px'}}/>
        {waveforms}
      </div>
    )
  }
}


export default AudioBlock;
