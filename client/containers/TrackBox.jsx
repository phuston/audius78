// Outside
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { playingMode, toolMode, UIConstants } from '../../utils.js';

// Styling 
import styles from './Containers.scss';

// Material
import Card from 'material-ui/lib/card/card';

// Components
import Row from '../components/Row/Row.jsx';

class TrackBox extends Component{
	constructor(props) {
		super(props);
	}

  render() {
    let rows;
  	if (this.props.workspace.rows) {
			rows = Array.prototype.map.call(this.props.workspace.rows, (row) => {
	  		return (
          <Card key={row.rowId}>
            <Row
              scrollX={this.props.workspace.scrollX}
              row={row}
              speed={this.props.workspace.timing.speed}
              currentZoom={this.props.workspace.zoomLevel}
              toolMode={this.props.workspace.toolMode}
              playing={this.props.workspace.playing}
              width={this.props.workspace.width}
              ee={this.props.ee}
            />
          </Card>
        );
	  	});
  	}

    let trackboxStyle = {
      'height': this.props.workspace.rows.length * (UIConstants.ROW_HEIGHT+4) + 70
    };

    return (
      <div className={styles.trackbox} style={trackboxStyle}>
        {rows}
      </div>
    )
  }
}


export default TrackBox;
