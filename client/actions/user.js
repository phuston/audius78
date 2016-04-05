import { createAction } from 'redux-actions';
import * as types from '../constants/ActionTypes';

export const addUser = createAction(types.ADD_USER, (userName)=>userName);
export const removeUser = createAction(types.REMOVE_USER, (userName)=>userName);