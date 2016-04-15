import { handleActions } from 'redux-actions';
import { filter } from 'filter-object';

export default handleActions({
  NEW_WORKSPACE: (state, action) => {
    console.log(action);
    return {...state, id: action.payload};
  },
  CONN_WORKSPACE: (state, action) => {
    return {...state, id: action.payload};
  },
  CONN_SOCKET: (state, action) => {
    return {...state, socket: action.payload};
  }
}, {});
