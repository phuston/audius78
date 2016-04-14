import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';

import store from './store/store';
import Workspace from './containers/Workspace.jsx';
import WelcomeBox from './containers/WelcomeBox.jsx';

// CHANGE ROUTER BACK TO WELCOME INSTEAD OF WORKSPACE

var Main = React.createClass({
  render: function() {
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
          <IndexRoute component={WelcomeBox}/>
          <Route path="/welcome" component={WelcomeBox}/>
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
