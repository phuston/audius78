var socketIO = require('socket.io');
var Workspace = require('../models/workspace');
var ObjectId = require('mongoose').Types.ObjectId;

var socketObject = {
  socketServer: function (server) {
    var io = socketIO.listen(server);

    io.sockets.on('connection', function(socket) {

      socket.on('connectWorkspace', function(username, hashcode){
        // TODO: Perform some sort of validation to ensure that workspace exists
        // Store username in socket session for this client
        socket.username = username;
        // Store room name in socket session for this client
        socket.workspaceId = hashcode;
        // Send client to workspace at hashcode
        socket.join(hashcode);
        // TODO: What do we need to emit to let the other users know to add a new user?
      });

      socket.on('removeBlocks', function(operation) {
        Workspace.findOne({id: socket.workspaceId}, function(err, workspace) {
          if (err) return console.error(err);

          var newRows = workspace.rows;
          var thisRow, thisBlock;
          var newBlocks;

          for (var i=0; i<newRows.length; i++) {
            thisRow = newRows[i];
            newBlocks = [];
            for (var j=0; j<thisRow.audioBlocks.length; j++) {
              thisBlock = thisRow.audioBlocks[j];
              if (operation[thisRow._id.toString()].indexOf(thisBlock._id.toString()) === -1) {
                newBlocks.push(thisBlock);
              }
            }
            newRows[i].audioBlocks = newBlocks;
          }

          Workspace.findByIdAndUpdate(
            workspace._id,
            {$set: {rows: newRows}},
            {$safe: true, upsert: false, new: true},
            function(err, newWorkspace) {
              if (err) return console.error(err);

              var response = {}
              newWorkspace.rows.map(function(row) {
                response[row.rowId] = row.audioBlocks;
              });

              // Emit socket event to notify all clients to update state
              io.sockets.in(socket.workspaceId).emit('applyRemoveBlocks', {
                response: response
              });
            }
          );
        });
      });

      socket.on('spliceBlocks', function(spliceOperation) {
        Workspace.findOne({id: socket.workspaceId}, function(err, workspace){
          if (err) return console.error(err);

          var newRows = workspace.rows;

          // Find correct row to update
          var updateRow = workspace.rows.filter(function (row){ 
            return row._id == spliceOperation.rowId;
          })[0];

          var leftBlock, rightBlock, index;

          // Store unaltered blocks in a new array so later can use $set instead of nested $push
          newBlocks = updateRow.audioBlocks.filter(function(block, i) {
            if (block._id == spliceOperation.leftBlockId) {
              leftBlock = block;
              index = i;
              return false;
            }

            if (block._id == spliceOperation.rightBlockId) {
              rightBlock = block;
              return false;
            }

            return true;
          });

          // Combine both blocks into the left block by setting a new file_end
          leftBlock.file_end = rightBlock.file_end;

          // Reinsert the left block
          newBlocks.splice(index, 0, leftBlock);

          // Update the correct row
          updateRow.audioBlocks = newBlocks;
          newRows[updateRow.rowId] = updateRow;

          // Updates DB state document
          Workspace.findByIdAndUpdate(
            workspace._id,
            {$set: {rows: newRows}},
            {safe: true, upsert: false, new: true},
            function(err, newWorkspace) {
              if (err) return console.error(err);

              // Emit socket event to notify all clients to update state
              io.sockets.in(socket.workspaceId).emit('applySpliceBlocks', {
                rowId: updateRow.rowId,
                newBlocks: newWorkspace.rows[updateRow.rowId].audioBlocks
              });
            }
          );
        });
      });

      socket.on('splitBlock', function(splitOperation) {
        Workspace.findOne({id: socket.workspaceId}, function(err, workspace){
          if (err) return console.error(err);

          var newRows = workspace.rows;

          // Find correct row to update
          var updateRow = workspace.rows.filter(function (row){ 
            return row._id == splitOperation.rowId 
          })[0];

          var leftBlock, index, newBlocks;
          var splitAt = splitOperation.operation.splitElement;

          // Store unaltered blocks in a new array so later can use $set instead of nested $push
          newBlocks = updateRow.audioBlocks.filter(function(block, i) {
            if (block._id == splitOperation.blockId) {
              leftBlock = block;
              index = i;
              return false;
            }
            return true;
          });

          // Share and compute attributes of old block into the two new left and right blocks
          var oldEnd = leftBlock.file_end;
          leftBlock.file_end = (splitAt % 2 === 0) ? splitAt : splitAt+1;

          var lengthOfBlock = (leftBlock.file_end - leftBlock.file_offset) / 2;
          var rightBlock = {
            row_offset: leftBlock.row_offset + lengthOfBlock,
            file_offset: leftBlock.file_end,
            file_end: oldEnd,
            flags: [],
            _id: new ObjectId()
          };

          // Add left and right blocks back. Must maintain order or else front-end
          // waveform generation will not work
          newBlocks.splice(index, 0, leftBlock);
          newBlocks.push(rightBlock);

          updateRow.audioBlocks = newBlocks;
          newRows[updateRow.rowId] = updateRow;

          // Updates DB state document
          Workspace.findByIdAndUpdate(
            workspace._id,
            {$set: {rows: newRows}},
            {safe: true, upsert: false, new: true},
            function(err, newWorkspace) {
              if (err) return console.error(err);

              // Emit socket event to notify all clients to update state
              io.sockets.in(socket.workspaceId).emit('applySplitBlock', {
                rowId: updateRow.rowId,
                newBlocks: newWorkspace.rows[updateRow.rowId].audioBlocks
              });
            }
          );
        });
      });

      socket.on('flagBlock', function(flagOperation){
        Workspace.findOne({id: socket.workspaceId}, function(err, workspace){
          if (err) return console.error(err);

          var newRows = workspace.rows;

          // Find correct row to update
          var updateRow = workspace.rows.filter(function (row){ 
            return row._id == flagOperation.rowId; 
          })[0];

          // Find correct audioBlock to update
          var audioBlock = updateRow.audioBlocks.filter(function (block){
            return block._id == flagOperation.blockId;
          });

          // Add the flag
          audioBlock.flags.push(flagOperation.flag);

          newRows[updateRow.rowId] = updateRow;

          Workspace.findByIdAndUpdate(
            workspace._id,
            {$set: {rows: newRows}},
            {$safe: true, upsert: false, new: true},
            function(err, newWorkspace) {
              if (err) return console.error(err);

              // Emit socket event to notify all clients to update state
              io.sockets.in(socket.workspaceId).emit('applyFlagBlock', {
                rowId: updateRow.rowId,
                blockId: audioBlock.blockId,
                newFlags: newWorkspace.rows[updateRow.rowId].audioBlocks[audioBlock.blockId].flags
              })
            }
          );
        })
      });

      socket.on('moveBlock', function(moveOperation){
        Workspace.findOne({id: socket.workspaceId}, function(err, workspace){
          if (err) return console.error(err);

          var newRows = workspace.rows;

          // Find correct row to update
          var updateRow = workspace.rows.filter(function(row){
            return row._id == moveOperation.rowId;
          })[0];

          var movedBlock, newBlocks, index;

          // Find correct audioBlock to update
          var newBlocks = updateRow.audioBlocks.filter(function (block, i) {
            if (block._id == moveOperation.blockId) {
              movedBlock = block;
              index = i;
              return false;
            }
            return true;
          });

          // Apply delta to block
          movedBlock.row_offset = Math.max(movedBlock.row_offset + moveOperation.operation.moveShift, 0);
          // Put block back in place
          newBlocks.splice(index, 0, movedBlock);
          // Set updated audio blocks
          updateRow.audioBlocks = newBlocks;
          // Set that row
          newRows[updateRow.rowId] = updateRow;

          Workspace.findByIdAndUpdate(
            workspace._id,
            {$set: {rows: newRows}},
            {$safe: true, upsert: false, new: true},
            function(err, newWorkspace) {
              if (err) return console.error(err);
              
              // Emit socket event to notify all clients to update state
              io.sockets.in(socket.workspaceId).emit('applyMoveBlock', {
                rowId: updateRow.rowId,
                newBlocks: newWorkspace.rows[updateRow.rowId].audioBlocks
              });
            }
          );
        })
      });

      socket.on('addRow', function(addOperation){
        Workspace.findOne({id: socket.workspaceId}, function(err, workspace){
          if (err) return console.error(err);

          var newRow;

          for (var i = 0; i < workspace.rows.length; i++) {
            if(workspace.rows[i]._id == addOperation.rowId) {
              newRow = workspace.rows[i];
              newRow.rowId = i;
            }
          }

          io.sockets.in(socket.workspaceId).emit('applyAddRow', {newRow: newRow});
        });
      });

      socket.on('removeRow', function(removeOperation){
        Workspace.findOne({id: socket.workspaceId}, function(err, workspace){
          if (err) return console.error(err);

          // Filter out the deleted row
          var newRows = workspace.rows.filter(function(row) {
            return row._id.toString() !== removeOperation.rowId;
          });

          // Update their rowId attribute to the correct index for front-end rendering purposes
          if (newRows.length > 0) {
            newRows = newRows.map(function(row, i) {
              row.rowId = i;
              return row;
            });
          }

          Workspace.findByIdAndUpdate(
            workspace._id,
            {$set: {rows: newRows}},
            {$safe: true, upsert: false, new: true},
            function(err, newWorkspace) {
              if (err) return console.error(err);

              // Emit socket event to notify all clients to update state
              io.sockets.in(socket.workspaceId).emit('applyRemoveRow', {deletedRowId: removeOperation.rowId});
            }
          );
        });
      });

      socket.on('changeRowGain', function(gainOperation) {
        Workspace.findOne({id: socket.workspaceId}, function(err, workspace) {
          if (err) return console.error(err);

          var changedRow, index;

          var newRows = workspace.rows.filter(function(row, i) {
            if (row._id.toString() === gainOperation.rowId) {
              changedRow = row;
              index = i;
              return false;
            }

            return true;
          });

          changedRow.gain = gainOperation.gain;
          newRows.splice(index, 0, changedRow);

          Workspace.findByIdAndUpdate(
            workspace._id,
            {$set: {rows: newRows}},
            {$safe: true, upsert: false, new: true},
            function(err, newWorkspace) {
              if (err) return console.error(err);

              io.sockets.in(socket.workspaceId).emit('applySetGain', {
                rowId: index,
                gain: gainOperation.gain
              });
            }
          );
        })
      })

    });
  },
}

module.exports = socketObject;
