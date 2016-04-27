// Outside
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';

// Styling 
import styles from './AudioBlock.scss'

// Others
import { playingMode, toolMode, UIConstants, selectColor } from '../../../utils.js';

// Audio Processing
import extractPeaks from 'webaudio-peaks';

// Components
import Waveform from '../Waveform/Waveform.jsx';

class AudioBlock extends Component {
	constructor(props) {
		super(props);

    this.handleStopDrag = this.handleStopDrag.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.numBlocks = this.props.data.audioBlocks.length;

    // moveShift is the amount moved from original position for each block
    this.moveShift = Array(this.numBlocks).fill(0);

    // Intial positions of each block. Used to calculate relative shifting.
    this.initialOffset = this.props.data.audioBlocks.map((block) => block.row_offset);
	}

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.data.audioBlocks.length !== this.numBlocks) {
      this.initialOffset = nextProps.data.audioBlocks.map((block) => block.row_offset);
      this.numBlocks = nextProps.data.audioBlocks.length;
      this.moveShift = Array(this.numBlocks).fill(0);
    }  
  }

  handleStopDrag(blockId, index, e) {
    // When user is done dragging, socket emits the event to update the server.
    let normalizedShift = this.moveShift[index] * this.props.currentZoom + this.initialOffset[index]
    this.props.emitMoveBlock(blockId, normalizedShift);
  }

  handleDrag(index, event, ui) {
    // Updates the shift amount by the dragged amount
    this.moveShift[index] += ui.deltaX;
  }

  render() {
  	let data = this.props.data;
    let dragDisabled = this.props.toolMode !== toolMode.DRAG;

  	let waveforms = data.audioBlocks.map((block, i) => {
      let background;
      if (block.selected) background = selectColor;
      let style = {
        'backgroundColor': background,
        'border': 'none',
        'display': 'inline-block',
        'position': 'absolute',
        'height': '100px',
        'top': UIConstants.TOP + data.rowId * (UIConstants.ROW_HEIGHT+4),
        'left': (block.row_offset) / this.props.currentZoom + UIConstants.LEFT - this.moveShift[i],
      };

  		return (
        <Draggable
          key={i}
          axis='x'
          disabled={dragDisabled}
          bounds={{left: -this.initialOffset[i] / this.props.currentZoom}}
          onDrag={this.handleDrag.bind(this, i)}
          onStop={this.handleStopDrag.bind(this, block._id, i)}
          >
    			<div style={style}>
    				<Waveform block={block} 
              highlightBlock={this.props.highlightBlock.bind(null, i)}
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

      case (toolMode.SELECT):
        audioBlockStyle.cursor = 'pointer';
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
