import { combineReducers } from 'redux';
import { routeReducer as routing } from 'redux-simple-router';

import users from './users';
import workspace from './workspace';

export default combineReducers({
  routing,
  users,
  workspace
});
