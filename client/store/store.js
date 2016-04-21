import { compose, applyMiddleware, createStore } from 'redux';
import rootReducer from '../reducers/root.js';
import promise from 'redux-promise';
import createLogger from 'redux-logger';
import * as workspaceActions from '../actions/workspace.js';

import { browserHistory } from 'react-router';
import { syncHistory } from 'redux-simple-router';

let middlewares = [promise];

const reduxRouter = syncHistory(browserHistory);
middlewares.push(reduxRouter);

if (process.env.NODE_ENV != 'production') {
    const createLogger = require('redux-logger');
    const logger = createLogger({collapse:true});
    // middlewares.push(logger);
}

const devTools = window.devToolsExtension ? window.devToolsExtension() : f => f;
let store = createStore(rootReducer, compose(applyMiddleware(...middlewares), devTools));

store.dispatch(workspaceActions.togglePlaying(false));
store.dispatch(workspaceActions.setSeeker(0));
store.dispatch(workspaceActions.setZoom(0.5));
store.dispatch(workspaceActions.setCursor(0));

reduxRouter.listenForReplays(store);

export default store;
