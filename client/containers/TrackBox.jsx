// Outside
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Styling 
import styles from './Containers.scss';

// Components
import Row from '../components/Row/Row.jsx';
import Time from '../components/Time/Time.jsx'

class Seeker extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let seekerStyle = {
      'position': 'absolute', 
      'top': '273px', 
      'left': this.props.left, 
      'width': '4px', 
      'border': '1px solid white', 
      'background': 'rgba(0,0,0,0.3)', 
      'zIndex': '5', 
      'height': '100px'
    };
    return <div id='seeker' style={seekerStyle}/>
  }
}


class TrackBox extends Component{
	constructor(props) {
		super(props);

    this.drawTimescale = this.drawTimescale.bind(this);
    this.updating = false;
	}

  drawTimescale(x) {
    this.updating = true;
    if (this.props.workspace.playing === true) {
      let req = window.requestAnimationFrame(this.drawTimescale.bind(null, x+5/60));
      this.props.updateTimescale(x);
    } else {
      this.updating = false;
    }
  }

  render() {
  	if (this.props.workspace.rows !== undefined) {
			var rows = Array.prototype.map.call(this.props.workspace.rows, (row) => {
	  		return (<Row key={row.rowId} rowData={row} currentZoom={this.props.workspace.zoomLevel}/>);
	  	});
  	}

    if (this.props.workspace.playing === true && this.updating === false) {
      this.drawTimescale(this.props.workspace.left);
    }

    return (
      <div>
        <Time workspace={this.props.workspace}/>
        <Seeker left={this.props.workspace.left}/>
        {rows}
      </div>
    )
  }
}


export default TrackBox;
