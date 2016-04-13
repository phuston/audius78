import { createAction } from 'redux-actions';
import * as types from '../constants/ActionTypes';

export const createWorkspace = createAction(types.CREATE_WORKSPACE, ()=>{
	return fetch(`/api/workspace/create`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'get',
        credentials: 'same-origin',
        body: JSON.stringify({subscriberId})
    })
    .then(response =>{
        return response.json();
    })
    .catch(err =>{
        console.log(err);
    })
});
export const loadWorkspace = createAction(types.ADD_WORKSPACE, (workspaceId) => {
	return fetch(`/api/workspace/load`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'get',
        credentials: 'same-origin',
        body: JSON.stringify({subscriberId})
    })
    .then(response =>{
        return response.json();
    })
    .catch(err =>{
        console.log(err);
    })
});
export const addRow = createAction(types.ADD_ROW, (newRows));
export const removeRow = createAction(types.REMOVE_ROW, (rowId));
export const flagBlock = createAction(types.FLAG_TRACK, (operation, rowId, blockId));
export const splitBlock = createAction(types.SPLIT_BLOCK, (rowId, blockId, time));
export const moveBlock = createAction(types.MOVE_BLOCK, (rowId, blockId, timeDelta));