import { handleActions } from 'redux-actions';
import { filter } from 'filter-object';

export default handleActions({
  LOAD_WORKSPACE: (state, action) => {
    return {...state, id: action.payload.id, rows: action.payload.rows};
  },

  CONN_SOCKET: (state, action) => {
  	return {...state, socket: action.payload};
  },

  AUDIO_CONTEXT: (state, action) => {
  	return {...state, audioCtx: action.payload};
  },
  
  // TODO: These below need to be rewritten
	ADD_ROW: (state, action) => {
		return {...state, rows: {...state.rows, [action.rowId]:action.newRow}};
  },

  REMOVE_ROW: (state, action) => {
    return {...state, [action.rowId]: action.rows};
  },

  FLAG_BLOCK: (state, action) => {
    var block = {...state.rows[action.rowId][action.blockId], flags: action.newFlags};
    var row = {...state[action.rowId], [action.blockId]:block};
    return {...state, rows: {...state.rows, [action.rowId]:row}};
  },

  SPLIT_BLOCK: (state, action) => {
    return {...state, rows: {...state.rows, [action.rowId]:action.newRow}};
  },

  MOVE_BLOCK: (state, action) => {
    return {...state, rows: {...state.rows, [action.rowId]:action.newRow}};
  }
}, {});
