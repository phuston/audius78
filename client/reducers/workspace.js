import { handleActions } from 'redux-actions';
import { filter } from 'filter-object';

export default handleActions({
  LOAD_WORKSPACE: (state, action) => {
    return {...state, id: action.payload.id, rows: action.payload.rows};
  },

  AUDIO_CONTEXT: (state, action) => {
  	return {...state, audioCtx: action.payload};
  },

  TOGGLE_PLAYING: (state, action) => {
    return {...state, playing: action.payload};
  },

  UPDATE_TIMESCALE: (state, action) => {
    return {...state, left: action.payload};
  },

  UPDATE_ZOOM: (state, action) => {
    let zoom = Math.min(Math.max(action.payload, 1/8), 8);
    console.log('reducer', zoom);
    return {...state, zoomLevel: zoom};
  },
  
	ADD_ROW: (state, action) => {
		return {...state, rows: {...state.rows, [action.payload.rowId]:action.payload.newRow}};
  },

  REMOVE_ROW: (state, action) => {
    let query = '!' + action.payload;
    return {...state, rows: filter(...state.rows, query)};
  },

  // TODO: Fix this (maybe) - not sure if actually broken
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

