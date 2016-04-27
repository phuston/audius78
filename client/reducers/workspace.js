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

  SET_WORKSPACE_WIDTH: (state, action) => {
    return {...state, width: action.payload};
  },

  SET_TOOL_MODE: (state, action) => {
    return {...state, toolMode: action.payload};
  },

  SET_SEEKER: (state, action) => {
    return {...state, timing: {...state.timing, seeker: Math.max(0,action.payload)}};
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
    return {...state, timing: {...state.timing, cursor: Math.max(0,action.payload)}};
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

  FLAG_BLOCK: (state, action) => {
    let block = state.rows[action.payload.rowId][action.payload.blockId];
    block.flags = action.payload.newFlags;
    let newBlocks = {...state[action.payload.rowId].audioBlocks, [action.payload.blockId]:block};
    let newRow = {...state[action.payload.rowId], audioBlocks: newBlocks}
    return {...state, rows: {...state.rows, [action.payload.rowId]:newRow}};
  },

  SPLIT_BLOCK: (state, action) => {
    let rowToUpdate = state.rows[action.payload.rowId];
    rowToUpdate.audioBlocks = action.payload.newBlocks;
    return {...state, rows: {...state.rows, [action.payload.rowId]: rowToUpdate}};
  },

  MOVE_BLOCK: (state, action) => {
    let rowToUpdate = state.rows[action.payload.rowId];
    rowToUpdate.audioBlocks = action.payload.newBlocks;
    return {...state, rows: {...state.rows, [action.payload.rowId]: rowToUpdate}};
    // let newBlocks = {...state.rows[action.payload.rowId].audioBlocks, [action.payload.blockId]: action.payload.newBlock}
    // let rowToUpdate = state.rows[action.payload.rowId];
    // rowToUpdate.audioBlocks = newBlocks;
    // return {...state, rows: {...state.rows, [action.payload.rowId]:rowToUpdate}};
  }
}, {});

