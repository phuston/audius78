// Outside
import { createAction } from 'redux-actions';
import * as types from '../constants/ActionTypes';

export const updateUsers = createAction(types.UPDATE_USERS, ()=>{
  return fetch(`/activeusers`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'get',
    credentials: 'same-origin',
  })
  .then(response =>{
    return response.json();
  })
  .catch(err =>{
    console.log(err);
  })
});
