import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';

import store from './store/store';
import Workspace from './containers/Workspace.jsx';
import Welcome from './containers/Welcome.jsx';

var Main = React.createClass({
  render: function() {
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route path="/" component={Welcome}/>
          <Route path="/workspace" component={Workspace}/>
        </Router>
      </Provider>
    );
  }
});

function run() {
  render(<Main />, document.getElementById("content"));
}

if (window.addEventListener) {
    window.addEventListener('DOMContentLoaded', run);
} else {
    window.attachEvent('onload', run);
}
