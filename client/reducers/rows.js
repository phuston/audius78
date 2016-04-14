import { handleActions } from 'redux-actions';
import { filter } from 'filter-object';

export default handleActions({
  NEW_WORKSPACE: (state, action) => {
    return {...state, workspaceId: action.payload};
  },
  CONN_WORKSPACE: (state, action) => {
    return {...state, workspaceId: action.payload};
  },
  ADD_ROW: (state, action) => {
    return {...state, ...action.row};
  },
  REMOVE_ROW: (state, action) => {
    return {...state, [action.rowId]: action.rows};
  },
  FLAG_BLOCK: (state, action) => {
    var block = {...state[action.rowId][action.blockId], flags: action.newFlags};
    var row = {...state[action.rowId], [action.blockId]:block};
    return {...state, [action.rowId]:row};
  },
  SPLIT_BLOCK: (state, action) => {
    return {...state, [action.rowId]:action.newRow};
  },
  MOVE_BLOCK: (state, action) => {
    return {...state, [action.rowId]:action.newRow};
  }
}, {});
