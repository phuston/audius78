import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import store from './store/store';
import Workspace from './containers/Workspace.jsx';
import WelcomeBox from './containers/WelcomeBox.jsx';

var Main = React.createClass({
  render: function() {
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route path="/" component={WelcomeBox}/>
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
