// Outside
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Styling 
import styles from './AudioBlock.scss'

// Others
import { playingMode, toolMode, UIConstants, flagType } from '../../../utils.js';

// Audio Processing
import extractPeaks from 'webaudio-peaks';

// Components
import Waveform from '../Waveform/Waveform.jsx';
import FadeCanvas from '../FadeCanvas/FadeCanvas.jsx';

class AudioBlock extends Component {
	constructor(props) {
		super(props);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.allowDrag = this.allowDrag.bind(this);
    this.allowFadeIn = this.allowFadeIn.bind(this);
    this.allowFadeOut = this.allowFadeOut.bind(this);
    this.seekAudio = this.seekAudio.bind(this);
    this.handleFade = this.handleFade.bind(this);

    this.totalMoved = 0;
    this.zIndices = {};
    this.totalMoved = {};
    this.initialOffset = {};
    this.fadeIn = null;
    this.fadeOut = null;

    this.props.row.audioBlocks.map( (block) => {
      this.zIndices[block._id] = 0;
      this.totalMoved[block._id] = 0;
      this.initialOffset[block._id] = block.row_offset;
    });
	}

  allowDrag() {
    return (this.props.toolMode === toolMode.DRAG && this.props.playing !== playingMode.PLAYING);
  }

  allowFadeIn() {
    return (this.props.toolMode === toolMode.FADEIN && this.props.playing !== playingMode.PLAYING);
  }

  allowFadeOut() {
    return (this.props.toolMode === toolMode.FADEOUT && this.props.playing !== playingMode.PLAYING);
  }

  componentWillUpdate(nextProps, nextState) {
    nextProps.row.audioBlocks.map( (block) => {
      this.zIndices[block._id] = this.zIndices[block._id] || 0;
      this.totalMoved[block._id] = this.totalMoved[block._id] || 0;
      this.initialOffset[block._id] = block.row_offset;
    });
  }

  onMouseDown(blockId, index, e) {
    if (this.allowDrag()) {
      e.preventDefault();
      this.zIndices[blockId] = 1;

      let el = e.target,
          prevX = e.clientX,
          emitShift = (x) => {
            let deltaX = x - prevX;
            prevX = x;
            this.totalMoved[blockId] += deltaX || 0;

            // Sets width to what it is, so that state "changes" and everything is forced to re-render. This makes the waveform "draggable".
            // Comment out this line to see the difference.
            this.props.ee.emit('setWidth', this.props.width-90);
          };

      // Dynamically adds onMouseMove event to element
      el.onmousemove = (e) => {
        e.preventDefault();
        emitShift(e.clientX);
      };

      let complete = (e) => {
        e.preventDefault();
        el.onmousemove = el.onmouseup = null;
        this.props.ee.emit('moveBlock', this.props.row._id, blockId, this.totalMoved[blockId] * this.props.currentZoom);
        this.totalMoved[blockId] = 0;
        this.zIndices[blockId] = 0;
      };

      el.onmouseup = complete;
    }
  }

  handleFade(block, rowId, width, e) {
    var zoom = this.props.currentZoom;
    // Send data for when zoom is 1. Let <FadeCanvas/> component do the math for different zoom levels
    if (this.allowFadeIn()) {
      e.preventDefault();
      var endInPixel = e.clientX - (block.row_offset / zoom) - UIConstants.LEFT - 2;
      this.props.ee.emit('setFadeIn', {
        end: endInPixel * zoom,
        blockId: block._id, 
        rowId: rowId,
        duration: endInPixel/this.props.speed,
      });
    }

    if (this.allowFadeOut()) {
      e.preventDefault();
      var startInPixel = e.clientX - (block.row_offset / zoom) - UIConstants.LEFT - 2;
      startInPixel *= zoom;
      var durationInPixel = width - startInPixel;
      this.props.ee.emit('setFadeOut', {
        start: startInPixel,
        end: width * zoom,
        blockId: block._id,
        rowId: rowId,
        duration: durationInPixel/this.props.speed,
      });
    }
  }

  seekAudio(e) {
    if (this.props.toolMode === toolMode.CURSOR) {
      if (this.props.playing === playingMode.PLAYING) {
        this.props.ee.emit('setSeeker', e.pageX - UIConstants.LEFT - 2);
      } else {
        this.props.ee.emit('setCursor', e.pageX - UIConstants.LEFT - 2);
      }
    }
  }  

  render() {
  	const row = this.props.row,
    background = '#00bcd4', // Color of the waveform
  	waveforms = row.audioBlocks.map((block, i) => {
      const style = {
        'backgroundColor': background,
        'border': 'none',
        'display': 'inline-block',
        'position': 'absolute',
        'height': '100px',
        'zIndex': '5',
        'top': UIConstants.TOP + row.rowId * (UIConstants.ROW_HEIGHT+7),
        'left': Math.max(this.initialOffset[block._id] / this.props.currentZoom + this.totalMoved[block._id], 0) + UIConstants.LEFT,
        'zIndex': this.zIndices[block._id],
      };

      let fadeInCanvas, fadeOutCanvas;

      block.flags.map((flag, i) => {
        switch (flag.type) {
          case flagType.FADEIN:
            this.fadeIn = flag;
            fadeInCanvas = <FadeCanvas fade={flag} zoom={this.props.currentZoom}/>;
            break;

          case flagType.FADEOUT:
            this.fadeOut = flag;
            fadeOutCanvas = <FadeCanvas fade={flag} zoom={this.props.currentZoom}/>;
            break;
        }
      });

      var zoom = this.props.currentZoom,
          peaks = extractPeaks(row.rawAudio, 2000*zoom, true), 
          firstPeak = Math.floor(block.file_offset / zoom),
          lastPeak = Math.ceil((block.file_end / zoom) || (peaks.data[0].length - 1)),
          width = peaks.data[0].slice(firstPeak, lastPeak).length/2 - 2;

  		return (
  			<div key={i} 
				style={style}
				onMouseDown={this.onMouseDown.bind(this, block._id, i)}
				onClick={this.handleFade.bind(this, block, row._id, width)}>
				{fadeInCanvas}
				{fadeOutCanvas}
				<Waveform block={block}
					row={row}
					blockIndex={i}
					selected={block.selected}
					playing={this.props.playing}
					toolMode={this.props.toolMode}
					currentZoom={this.props.currentZoom}
					ee={this.props.ee}
				/>
  			</div>
			);
  	});

    // Sets cursor image depending on tool mode
    const audioBlockStyle = {
      'cursor': 'auto', 
      'width': this.props.width, 
      'height': UIConstants.ROW_HEIGHT+4,
      'marginTop': (row.rowId === 0 ? 12 : 4),
    };

    switch (this.props.toolMode) {
      case (toolMode.SPLIT):
        audioBlockStyle.cursor = 'url("/icons/cut.png"),auto';
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
