// Outside
import React, { Component } from 'react';

// Styling 
import styles from './Containers.scss';

// Components
import Row from '../components/Row/Row.jsx';
import Time from '../components/Time/Time.jsx'


class TrackBox extends Component{
	constructor(props) {
		super(props);
	}

  render(){
  	if (this.props.workspace.rows !== undefined) {
			var rows = Array.prototype.map.call(this.props.workspace.rows, (row) => {
	  		return (<Row key={row.rowId} rowData={row}/>);
	  	});
  	}

    return (
      <div>
        <Time workspace={this.props.workspace}/>
        {rows}
      </div>
    )
  }
}


export default TrackBox;
