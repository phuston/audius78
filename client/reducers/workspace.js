import { handleActions } from 'redux-actions';
import { filter } from 'filter-object';

export default handleActions({
  NEW_WORKSPACE: (state, action) => {
    return {...state, id: action.payload};
  },
  LOAD_WORKSPACE: (state, action) => {
    return {...state, ...action.payload};
  }
}, {});
