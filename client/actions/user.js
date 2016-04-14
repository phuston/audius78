import { createAction } from 'redux-actions';
import * as types from '../constants/ActionTypes';

export const updateUsers = createAction(types.UPDATE_USERS, ()=>{
    return fetch('/api/activeusers')
});