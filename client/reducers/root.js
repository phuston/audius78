import { combineReducers } from 'redux';
import { routeReducer as routing } from 'redux-simple-router';

import audio from './audio';
import row from './row';

export default combineReducers({
    routing,
    users,
    audio
});
