import { handleActions } from 'redux-actions';

export default handleActions({
	UPDATE_USERS: (state, action) => action.payload
}, {});
