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
export const addRow = createAction(types.ADD_ROW);
export const removeRow = createAction(types.REMOVE_ROW);
export const flagTrack = createAction(types.FLAG_TRACK);
export const splitTrack = createAction(types.SPLIT_TRACK);
export const moveTrack = createAction(types.MOVE_TRACK);