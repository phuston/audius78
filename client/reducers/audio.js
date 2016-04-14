import { handleActions } from 'redux-actions';

export default handleActions({
    ADD_ROW: (state, action) => (
        // TODO: add a new row with the specified audio tag
        // TODO: figure out where the hell the downloading is supposed to go
    ),
    REMOVE_ROW: (state, action) => (
        // TODO: remove the track specified in the action here
    ),
    FLAG_TRACK: (state, action) => (
        var flags = [...state[action.payload.rowId][action.payload.blockId].flags, action.payload.newFlag];
        var block = {...state[action.payload.rowId][action.payload.blockId], flags};
        var row = {...state[action.payload.rowId], [action.payload.blockId]:block};
        return {...state, [action.payload.rowId]:row}
    ),
    SPLIT_TRACK: (state, action) => (
        // TODO: do some here
    ),
    MOVE: TRACK: (state, action) => (
        // TODO: do some here
    )
}, {});


export default handleActions({
    FETCH_PENDING_FRIENDS: (state, action) => {
        flags = [...state[action.payload.rowId][action.payload.blockId][flags], action.payload.newTags]
        newBlock = {...state, ...{state[action.payload.rowId][action.payload.blockId], flags}}
    }
}, {})

