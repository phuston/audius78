import { combineReducers } from 'redux';
import { routeReducer as routing } from 'redux-simple-router';

import rows from './rows';
import users from './users';

export default combineReducers({
  routing,
  users,
  rows
});
