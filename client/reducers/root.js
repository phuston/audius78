import { combineReducers } from 'redux';
import { routeReducer as routing } from 'redux-simple-router';

import user from './user';
import row from './row';

export default combineReducers({
    routing,
    user,
    row
});
