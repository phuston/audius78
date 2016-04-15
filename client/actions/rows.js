import { createAction } from 'redux-actions';
import * as types from '../constants/ActionTypes';

export const addRow = createAction(types.ADD_ROW, (newRows) => {
  return newRows;
});
export const removeRow = createAction(types.REMOVE_ROW, (rowId) => {
  return rowId;
});
export const flagBlock = createAction(types.FLAG_TRACK, (rowId, blockId, operation) => {
  return {
    rowId: rowId, 
    blockId: blockId,
    operation: operation
  }
});
export const splitBlock = createAction(types.SPLIT_BLOCK, (rowId, blockId, time) => {
  return {
    rowId: rowId,
    blockId: blockId,
    time: time
  }
});
export const moveBlock = createAction(types.MOVE_BLOCK, (rowId, blockId, timeDelta) => {
  return {
    rowId: rowId,
    blockId: blockId,
    timeDelta: timeDelta
  }
});
