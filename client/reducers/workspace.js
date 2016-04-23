import { handleActions } from 'redux-actions';
import { filter } from 'filter-object';
import { zoomLimits } from '../../utils';

export default handleActions({
  LOAD_WORKSPACE: (state, action) => {
    return {...state, id: action.payload.id, rows: action.payload.rows};
  },

  SET_PLAYING_MODE: (state, action) => {
    return {...state, playing: action.payload};
  },

  SET_TOOL_MODE: (state, action) => {
    return {...state, toolMode: action.payload};
  },

  SET_SEEKER: (state, action) => {
    return {...state, timing: {...state.timing, seeker: action.payload}};
  },

  SET_ZOOM: (state, action) => {
    let zoom = Math.min(Math.max(action.payload, zoomLimits.LOWER), zoomLimits.UPPER);
    let zoomRatio = state.zoomLevel/zoom;
    return {...state, zoomLevel: zoom};
  },

  STOP_PLAYING: (state, action) => {
    return {...state, playing: action.payload};
  },

  SET_CURSOR: (state, action) => {
    return {...state, timing: {...state.timing, cursor: action.payload}};
  },

  SET_SPEED: (state, action) => {
    return {...state, timing: {...state.timing, speed: action.payload}};
  },
  
  ADD_ROW: (state, action) => {
    let oldLength = state.rows.length;
		return {...state, rows: {...state.rows, [action.payload.rowId]:action.payload, length: oldLength+1}};
  },

  REMOVE_ROW: (state, action) => {
    // TODO: Tentative, might not work. Also update indices
    let query = '!' + action.payload;
    let newRows = filter(state.rows, query);
    newRows.length -= 1;
    return {...state, rows: newRows};
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

