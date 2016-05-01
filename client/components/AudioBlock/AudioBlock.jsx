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

    this.onMouseDown = this.onMouseDown.bind(this);
    this.allowDrag = this.allowDrag.bind(this);
    this.seekAudio = this.seekAudio.bind(this);
    this.totalMoved = 0;
    this.zIndices = {};
    this.totalMoved = {};
    this.initialOffset = {};

    this.props.data.audioBlocks.map( (block) => {
      this.zIndices[block._id] = 0;
      this.totalMoved[block._id] = 0;
      this.initialOffset[block._id] = block.row_offset;
    });
	}

  allowDrag() {
    return (this.props.toolMode === toolMode.DRAG && this.props.playing !== playingMode.PLAYING);
  }

  componentWillUpdate(nextProps, nextState) {
    nextProps.data.audioBlocks.map( (block) => {
      this.zIndices[block._id] = this.zIndices[block._id] || 0;
      this.totalMoved[block._id] = this.totalMoved[block._id] || 0;
      this.initialOffset[block._id] = block.row_offset;
    });
  }

  onMouseDown(blockId, index, e) {
    if (this.allowDrag()) {
      e.preventDefault();
      this.zIndices[blockId] = 1;

      let el = e.target;
      let prevX = e.clientX;

      let emitShift = (x) => {
        let deltaX = x - prevX;
        prevX = x;
        this.totalMoved[blockId] += deltaX || 0;

        // Sets width to what it is, so that state "changes" and everything is forced to re-render. This makes the waveform "draggable".
        // Comment out this line to see the difference.
        this.props.setWorkspaceWidth(this.props.width-90);
      };

      // Dynamically adds onMouseMove event to element
      el.onmousemove = (e) => {
        e.preventDefault();
        emitShift(e.clientX);
      };

      let complete = (e) => {
        e.preventDefault();
        el.onmousemove = el.onmouseup = null;
        this.props.emitMoveBlock(blockId, this.totalMoved[blockId] * this.props.currentZoom);
        this.totalMoved[blockId] = 0;
        this.zIndices[blockId] = 0;
      };

      el.onmouseup = complete;
    }
  }

  seekAudio(e) {
    if (this.props.toolMode === toolMode.CURSOR) {
      if (this.props.playing === playingMode.PLAYING) {
        this.props.setSeeker(e.pageX - UIConstants.LEFT - 2);
      } else {
        this.props.setCursor(e.pageX - UIConstants.LEFT - 2);
      }
    }
  }  

  render() {
  	let data = this.props.data;
  	let waveforms = data.audioBlocks.map((block, i) => {
      let background = '#16783C';
      // if (block.selected) background = selectColor;
      let style = {
        'backgroundColor': background,
        'border': 'none',
        'display': 'inline-block',
        'position': 'absolute',
        'height': '100px',
        'top': UIConstants.TOP + data.rowId * (UIConstants.ROW_HEIGHT+4),
        'left': Math.max(this.initialOffset[block._id] / this.props.currentZoom + this.totalMoved[block._id], 0) + UIConstants.LEFT,
        'zIndex': this.zIndices[block._id],
      };

  		return (
  			<div key={i} style={style} onMouseDown={this.onMouseDown.bind(this, block._id, i)}>
  				<Waveform block={block}
            highlightBlock={this.props.highlightBlock.bind(null, i)}
            emitSplitBlock={this.props.emitSplitBlock}
            selected={block.selected}
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
			);
  	});

    // Sets cursor image depending on tool mode
    let audioBlockStyle = {
      'cursor': 'auto', 
      'width': this.props.width, 
      'background': '#282928', 
      'height': UIConstants.ROW_HEIGHT+4,
      'marginTop': (data.rowId === 0 ? 12 : 0),
    };
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
      <div className={styles.audioBlock} style={audioBlockStyle} onClick={this.seekAudio}>
        {waveforms}
      </div>
    )
  }
}


export default AudioBlock;
