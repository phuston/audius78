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

    this.handleStopDrag = this.handleStopDrag.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.initialOffset = this.props.data.audioBlocks.map((block) => block.row_offset);
    this.numBlocks = this.props.data.audioBlocks.length;
    this.moveShift = Array(this.numBlocks).fill(0);
    console.log('moveShift', this.moveShift);
    // console.log('initialOffset', this.initialOffset);
	}

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.data.audioBlocks.length !== this.numBlocks) {
      this.initialOffset = nextProps.data.audioBlocks.map((block) => block.row_offset);
      this.numBlocks = nextProps.data.audioBlocks.length;
      this.moveShift = Array(this.numBlocks).fill(0);
      // console.log('initialOffset', this.initialOffset);
    }  
  }

  handleStopDrag(blockId, index, e) {
    // Normalize this.moveShift
    console.log('moveShift', this.moveShift[index] * this.props.currentZoom, 'index', index);
    this.props.emitMoveBlock(blockId, this.moveShift[index] * this.props.currentZoom + this.initialOffset[index]);
  }

  handleDrag(index, event, ui) {
    this.moveShift[index] += ui.deltaX;
  }

  render(){
  	let data = this.props.data;
    let dragDisabled = this.props.toolMode !== toolMode.DRAG;

  	let waveforms = data.audioBlocks.map((block, i) => {
      let style = {
        'border': 'none',
        'display': 'inline-block',
        'position': 'absolute',
        'top': 272 + data.rowId * 104,
        'left': (block.row_offset) / this.props.currentZoom + 88 - this.moveShift[i],
      };
      console.log('left attribute', style.left);
      console.log('left boundary', -block.row_offset / this.props.currentZoom);

  		return (
        <Draggable
          key={i}
          axis='x'
          disabled={dragDisabled}
          bounds={{left: -this.initialOffset[i] / this.props.currentZoom}}
          onDrag={this.handleDrag.bind(this, i)}
          onStop={this.handleStopDrag.bind(this, block._id, i)}
          >
    			<div height={100} style={style}>
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
