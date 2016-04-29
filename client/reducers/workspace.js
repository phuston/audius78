import { handleActions } from 'redux-actions';
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

  TOGGLE_ROW_DELETE: (state, action) => {
    return {...state, allowRowDelete: action.payload};
  },

  HIGHLIGHT_BLOCK: (state, action) => {
    let blocks = state.rows[action.payload.rowIndex].audioBlocks;
    blocks[action.payload.blockIndex].selected = !blocks[action.payload.blockIndex].selected;
    return {
      ...state, 
      rows: {
        ...state.rows, 
        [action.payload.rowIndex]: {
          ...state.rows[action.payload.rowIndex],
          audioBlocks: blocks,
        }
      }
    };
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
    let updatedRows = {};
    let numRow = 0;
    let thisRow;
    for (var key in state.rows) {
      if (key === 'length') {
        updatedRows.length = state.rows.length - 1;
      } else {
        if (state.rows[key]._id !== action.payload.deletedRowId) {
          thisRow = state.rows[key];
          thisRow.rowId = numRow;
          updatedRows[Number(numRow)] = thisRow;
          numRow++;
        }
      }
    }
    return {...state, rows: updatedRows};
  },

  REMOVE_BLOCKS: (state, action) => {
    let newRows = state.rows;
    Array.prototype.forEach.call(newRows, (row, i) => {
      if (action.payload.response[row.rowId] !== undefined) {
        newRows[row.rowId].audioBlocks = action.payload.response[row.rowId];
      }
    });
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
  }
}, {});

