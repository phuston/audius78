// Outside
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';

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
    let dragDisabled = this.props.toolMode !== toolMode.DRAG;

  	let waveforms = data.audioBlocks.map((block, i) => {
  		return (
        <Draggable
          key={i}
          axis='x'
          defaultPosition={{x: 0, y: 273}}
          disabled={dragDisabled}
          bounds={{left: 0}}
          onDrag={this.handleDrag}
          >
    			<div height={100} style={{'border': 'none', 'display': 'inline-block'}}>
    				<Waveform block={block} 
              emitSplitBlock={this.props.emitSplitBlock}
              playing={this.props.playing}
              toolMode={this.props.toolMode}
              currentZoom={this.props.currentZoom} 
              rawAudio={this.props.data.rawAudio}
              setCursor={this.props.setCursor}
              setSeeker={this.props.setSeeker}
              setSpeed={this.props.setSpeed}
              setWorkspaceWidth={this.props.setWorkspaceWidth}
            />
    			</div>
        </Draggable>
			);
  	});

    // Sets cursor image depending on tool mode
    let audioBlockStyle = {'cursor': 'auto', 'width': this.props.width};
    switch (this.props.toolMode) {
      case (toolMode.SPLIT):
        audioBlockStyle.cursor = 'url("http://localhost:3000/icons/cut.png"),auto';
        break;

      case (toolMode.DRAG):
        audioBlockStyle.cursor = 'move';
        break;
    }

    return (
      <div className={styles.audioBlock} style={audioBlockStyle}>
        {waveforms}
      </div>
    )
  }
}


export default AudioBlock;
