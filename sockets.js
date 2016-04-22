var socketIO = require('socket.io');
var Workspace = require('./models/workspace')

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

        console.log("hashcode ", hashcode);
      });

      socket.on('splitBlock', function(splitOperation){
        Workspace.findOne({id: socket.workspaceId}, function(err, workspace){
          if (err) {
            console.log(err);
          } else {
            console.log(workspace);
            // TODO: update the workspace here!
            var updatedState = {};
            io.sockets.in(socket.workspaceId).emit('applySplitBlock', updatedState);
          }
        });
      });

      socket.on('flagBlock', function(flagOperation){
        Workspace.findOne({id: socket.workspaceId}, function(err, workspace){
          if (err) {
            console.log(err);
          } else {
            // TODO: update the workspace here!
            console.log(workspace);
            var updatedState = {};
            io.sockets.in(socket.workspaceId).emit('applyFlagBlock', updatedState);
          }
        })
      });

      socket.on('moveBlock', function(moveOperation){
        Workspace.findOne({id: socket.workspaceId}, function(err, workspace){
          if (err) {
            console.log(err);
          } else {
            console.log(workspace);
            // TODO: update the workspace here!
            var updatedState = {};
            io.sockets.in(socket.workspaceId).emit('applyMoveBlock', updatedState);
          }
        })
      });

      socket.on('addRow', function(addOperation){
        Workspace.findOne({id: socket.workspaceId}, function(err, workspace){
          var newRow;

          for (var i = 0; i < workspace.rows.length; i++) {
            if(workspace.rows[i]._id == addOperation.rowId) {
              newRow = workspace.rows[i];
              newRow.rowId = i;
            }
          }
          var applyOperation = {
            newRow: newRow
          }
          io.sockets.in(socket.workspaceId).emit('applyAddRow', applyOperation);
        })
      });

      socket.on('removeRow', function(removeOperation){
        // TODO: Same pattern as above
      })

      // TODO: What other operations do we need to support? Adding a row? Does that happen here?
    });
  },
}

module.exports = socketObject;
