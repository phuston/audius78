// Outside
import { createAction } from 'redux-actions';
import * as types from '../constants/ActionTypes';
import utils from '../../utils';

export const newWorkspace = createAction(types.LOAD_WORKSPACE, (audioCtx)=>{
  return fetch(`/api/workspace/create`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'post',
    credentials: 'same-origin',
  })
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    return Promise.all(data.workspace.rows.map((row) => {
      return fetch(row.rawAudio);
    }))
    .then((files) => {
      return Promise.all(files.map((file) => {
        return file.arrayBuffer();
      }))
      .then((arrayBuffers) => {
        return Promise.all(arrayBuffers.map((arrayBuffer) => {
          return audioCtx.decodeAudioData(arrayBuffer);
        }))
        .then((buffers) => {
          let rows = {}
          let len;

          data.workspace.rows.map((row, i) => {
            row.rawAudio = buffers[i];
            rows[Number(i)] = row;
            len = i;
            return row;
          });

          rows.length = len+1;
          return {id: data.workspace.id, rows: rows}; 
        });
      });
    });
  })
  .catch(err =>{
    console.log(err);
  });
});

export const loadWorkspace = createAction(types.LOAD_WORKSPACE, (workspaceId, audioCtx) => {
  return fetch(`/api/workspace/load`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'post',
    credentials: 'same-origin',
    body: JSON.stringify({'id': workspaceId})
  })
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    return Promise.all(data.workspace.rows.map((row) => {
      return fetch(row.rawAudio);
    }))
    .then((files) => {
      return Promise.all(files.map((file) => {
        return file.arrayBuffer();
      }))
      .then((arrayBuffers) => {
        return Promise.all(arrayBuffers.map((arrayBuffer) => {
          return audioCtx.decodeAudioData(arrayBuffer);
        }))
        .then((buffers) => {
          let rows = {}
          let len;

          data.workspace.rows.map((row, i) => {
            row.rawAudio = buffers[i];
            rows[Number(i)] = row;
            len = i;
            return row;
          });

          rows.length = len+1;
          return {id: data.workspace.id, rows: rows}; 
        });
      });
    });
  })
  .catch(err =>{
    console.log(err);
  });
});

export const setWorkspaceWidth = createAction(types.SET_WORKSPACE_WIDTH, (width) => {
  return width;
});

export const addRow = createAction(types.ADD_ROW, (addOperation, audioCtx) => {
  
  return fetch(addOperation.newRow.rawAudio)
  .then((file) => {
    return file.arrayBuffer();
  })
  .then((arrayBuffer) => {
    return audioCtx.decodeAudioData(arrayBuffer)
  })
  .then((buffer) => {
    // Have to close the audioCtx used to create buffer objects
    audioCtx.close();

    addOperation.newRow.rawAudio = buffer;
    return addOperation.newRow;
  })
  .catch(err => {
    console.log(err);
  });
});

export const toggleRowDelete = createAction(types.TOGGLE_ROW_DELETE, (status) => {
  return status;
});

export const setScroll = createAction(types.SET_SCROLL, (amount) => {
  return amount;
});

export const removeRow = createAction(types.REMOVE_ROW, (updatedRows) => {
  return updatedRows;
});

export const removeBlocks = createAction(types.REMOVE_BLOCKS, (newBlocksPerRow) => {
  return newBlocksPerRow;
});

export const spliceBlocks = createAction(types.SPLICE_BLOCKS, (newBlocksPerRow) => {
  return newBlocksPerRow;
});

export const highlightBlock = createAction(types.HIGHLIGHT_BLOCK, (blockInfo) => {
  return blockInfo;
});

export const flagBlock = createAction(types.FLAG_TRACK, (flagOperation) => {
  return flagOperation;
});

export const splitBlock = createAction(types.SPLIT_BLOCK, (splitOperation) => {
  return splitOperation;
});

export const moveBlock = createAction(types.MOVE_BLOCK, (moveOperation) => {
  return moveOperation;
});

export const setPlayingMode = createAction(types.SET_PLAYING_MODE, (mode) => {
  return mode;
});

export const setToolMode = createAction(types.SET_TOOL_MODE, (mode) => {
  return mode;
});

export const setSeeker = createAction(types.SET_SEEKER, (seeker) => {
  return seeker;
});

export const setZoom = createAction(types.SET_ZOOM, (zoom) => {
  return zoom;
});

export const setRowGain = createAction(types.SET_ROW_GAIN, (info) => {
  return info;
});

export const stopPlaying = createAction(types.STOP_PLAYING, (stop) => {
  return stop;
});

export const setCursor = createAction(types.SET_CURSOR, (cursor) => {
  return cursor;
});

export const setSpeed = createAction(types.SET_SPEED, (speed) => {
  return speed;
});

export const applyFade = createAction(types.APPLY_FADE, (fadeOperation) => {
  return fadeOperation;
});



