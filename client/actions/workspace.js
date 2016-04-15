import { createAction } from 'redux-actions';
import * as types from '../constants/ActionTypes';
import utils from '../../utils';

export const newWorkspace = createAction(types.NEW_WORKSPACE, ()=>{
  return fetch(`/workspace/create`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'post',
    credentials: 'same-origin',
  })
  .then((response) => {
    return response.json();
  }).then((data) => {
    return {id: data.hash, rows: utils.modelToState(data.workspace)};
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
    body: JSON.stringify({"id": workspaceId})
  })
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(utils.modelToState(data.workspace));
    return {id: data.workspace.id, rows: utils.modelToState(data.workspace.rows)};
  })
  .catch(err =>{
    console.log(err);
  })
});

export const addRow = createAction(types.ADD_ROW, (filename, newRow) => {
  // Make a request to download the file at filename served statically, decode it, add to newRow object, return that
  return newRows;
});

export const removeRow = createAction(types.REMOVE_ROW, (rowId) => {
  return rowId;
});

export const flagBlock = createAction(types.FLAG_TRACK, (newFlags) => {
  return newFlags;
});

export const splitBlock = createAction(types.SPLIT_BLOCK, (newBlocks) => {
  return newBlocks;
});

export const moveBlock = createAction(types.MOVE_BLOCK, (newBlocks) => {
  return newBlocks;
});
