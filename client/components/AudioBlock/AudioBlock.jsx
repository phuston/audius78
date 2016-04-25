// Outside
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Styling 
import styles from './AudioBlock.scss'

// Others
import { playingMode, toolMode } from '../../../utils.js';

// Audio Processing
import extractPeaks from 'webaudio-peaks';

// Components
import Waveform from '../Waveform/Waveform.jsx';

class AudioBlock extends Component {
	constructor(props) {
		super(props);
	}

  render(){
  	let data = this.props.data;

  	let waveforms = data.audioBlocks.map((block, i) => {
  		return (
  			<div key={i} height={100} style={{'border': 'none', 'display': 'inLine'}}>
  				<Waveform block={block} 
            emitSplitBlock={this.props.emitSplitBlock}
            playing={this.props.playing}
            toolMode={this.props.toolMode}
            currentZoom={this.props.currentZoom} 
            rawAudio={this.props.data.rawAudio}
            setCursor={this.props.setCursor}
            setSeeker={this.props.setSeeker}
            setSpeed={this.props.setSpeed}/>
  			</div>
			);
  	});

    // Sets cursor image depending on tool mode
    let cursorImage = {'cursor': 'auto'};
    switch (this.props.toolMode) {
      case (toolMode.SPLIT):
        cursorImage = {'cursor': 'url("http://localhost:3000/icons/cut.png"),auto'};
        break;

      case (toolMode.DRAG):
        cursorImage = {'cursor': 'move'};
        break;
    }

    return (
      <div className={styles.audioBlock} style={cursorImage}>
        {waveforms}
      </div>
    )
  }
}


export default AudioBlock;
