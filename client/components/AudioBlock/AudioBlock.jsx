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
    this.moveShift = {};
    this.initialOffset = {};

    // Intial positions of each block. Used to calculate relative shifting.
    this.props.data.audioBlocks.map((block) => {
      this.moveShift[block._id] = 0;
      this.initialOffset[block._id] = block.row_offset;
    });
	}

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.data.audioBlocks.length !== this.numBlocks || nextProps.data._id !== this.props.data._id) {
      let newMoveShift = {};
      let newInitialOffset = {};
      nextProps.data.audioBlocks.map((block, i) => {
        newMoveShift[block._id] = this.moveShift[block._id] === undefined ? 0 : this.moveShift[block._id];
        newInitialOffset[block._id] = this.initialOffset[block._id] === undefined ? block.row_offset : this.initialOffset[block._id];
      });
      this.moveShift = newMoveShift;
      this.initialOffset = newInitialOffset;
      this.numBlocks = nextProps.data.audioBlocks.length;
    }  
  }

  handleStopDrag(blockId, index, e) {
    // When user is done dragging, socket emits the event to update the server.
    let normalizedShift = this.moveShift[blockId] * this.props.currentZoom + this.initialOffset[blockId];
    this.props.emitMoveBlock(blockId, normalizedShift);
  }

  handleDrag(blockId, event, ui) {
    // Updates the shift amount by the dragged amount
    this.moveShift[blockId] += ui.deltaX;
  }

  render() {
  	let data = this.props.data;
    let dragDisabled = this.props.toolMode !== toolMode.DRAG;
    console.log('audioblock sending', data.rawAudio);
  	let waveforms = data.audioBlocks.map((block, i) => {
      let background = '#16783C';
      if (block.selected) background = selectColor;
      let style = {
        'id': block._id,
        'backgroundColor': background,
        'border': 'none',
        'display': 'inline-block',
        'position': 'absolute',
        'height': '100px',
        'top': UIConstants.TOP + data.rowId * (UIConstants.ROW_HEIGHT+4),
        'left': (block.row_offset) + UIConstants.LEFT - this.moveShift[block._id],
      };

  		return (
        <Draggable
          key={i}
          axis='x'
          disabled={dragDisabled}
          bounds={{left: -this.initialOffset[block._id] / this.props.currentZoom}}
          onDrag={this.handleDrag.bind(this, block._id)}
          onStop={this.handleStopDrag.bind(this, block._id, i)}
          >
    			<div style={style}>
    				<Waveform block={block} 
              moveShift={this.moveShift[block._id]}
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
