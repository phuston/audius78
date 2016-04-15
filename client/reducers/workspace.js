import { handleActions } from 'redux-actions';
import { filter } from 'filter-object';

export default handleActions({
  NEW_WORKSPACE: (state, action) => {
    return {...state, id: action.payload.id, rows: action.payload.rows};
  },

  LOAD_WORKSPACE: (state, action) => {
  	let audioCtx = state.audioCtx;

  	return Promise.all(Array.prototype.map.call(action.payload.rows, (row, i) => {
  		let source = audioCtx.createBufferSource();
  		return audioCtx.decodeAudioData(action.payload.files[i]);
  	})).then(function(buffers) {
  		let rows = Array.prototype.map.call(action.payload.rows, (row, i) => {
  			row.rawAudio = buffers[i];
  			return row;
  		});
	    return {...state, id: action.payload.id, rows: rows};
  	});
  },

  CONN_SOCKET: (state, action) => {
  	return {...state, socket: action.payload};
  },

  AUDIO_CONTEXT: (state, action) => {
  	return {...state, audioCtx: action.payload};
  },
  
  // TODO: These below need to be rewritten
	ADD_ROW: (state, action) => {
		return {...state, rows: {...state.rows, [action.rowId]:action.newRow}};
  },

  REMOVE_ROW: (state, action) => {
    return {...state, [action.rowId]: action.rows};
  },

  FLAG_BLOCK: (state, action) => {
    var block = {...state.rows[action.rowId][action.blockId], flags: action.newFlags};
    var row = {...state[action.rowId], [action.blockId]:block};
    return {...state, rows: {...state.rows, [action.rowId]:row}};
  },

  SPLIT_BLOCK: (state, action) => {
    return {...state, rows: {...state.rows, [action.rowId]:action.newRow}};
  },

  MOVE_BLOCK: (state, action) => {
    return {...state, rows: {...state.rows, [action.rowId]:action.newRow}};
  }
}, {});
