import { createAction } from 'redux-actions';
import * as types from '../constants/ActionTypes';

export const newWorkspace = createAction(types.NEW_WORKSPACE, ()=>{
  return fetch(`/workspace/create`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'post',
    credentials: 'same-origin',
  })
  .then(response =>{
    return response.json();
  })
  .catch(err =>{
    console.log(err);
  })
});
export const loadWorkspace = createAction(types.LOAD_WORKSPACE, (workspaceId) => {
  return fetch(`/workspace/load`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'post',
    credentials: 'same-origin',
    body: JSON.stringify({workspaceId})
  })
  .then(response =>{
    if(response.status == 200){
      return response.json();
    } else {
      // TODO: Figure out how to deal with error here?
    }
  })
  .catch(err =>{
    console.log(err);
  })
});

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
