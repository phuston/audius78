import { handleActions } from 'redux-actions';
import { filter } from 'filter-object';

export default handleActions({
	ADD_ROW: (state, action) => (
		return [...state, action.payload.rowId: action.payload.rows]
	),
	REMOVE_ROW: (state, action) => (
		var remove = "!" + action.payload.rowId;
		return filter(state, remove)
	),
	FLAG_BLOCK: (state, action) => (
        var block = {...state[action.payload.rowId][action.payload.blockId], action.payload.newFlags}
        var row = {...state[action.payload.rowId], action.payload.blockId:block}
        return {...state, [action.payload.rowId]:row}
	),
	SPLIT_BLOCK: (state, action) => (
		return {...state, action.payload.rowId:action.payload.newRows}
	),
	MOVE_BLOCK: (state, action) => (
		return {...state, action.payload.rowId:action.payload.newRows}
	)
}, {});
