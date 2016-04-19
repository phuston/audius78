var socketIO = require('socket.io');
var Workspace = require('./models/workspace.js');

var socketObject = {
  socketServer: function (server) {
    var io = socketIO.listen(server);

    io.sockets.on('connection', function(socket) {
      console.log('connected');

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

      socket.on('splitBlock', function(splitOperation){
        Workspace.findOne({id: socket.workspaceId}, function(err, workspace){
          if (err) {
            console.log(err);
          } else {
            console.log(workspace);
            io.sockets.in(socket.workspaceId).emit('splitBlock', updatedState);
          }
        });
        // TODO: Grab the correct workspace using socket.workspace
        // TODO: Update the state
        // TODO: Emit event using 'io.sockets.in(socket.workspace).emit('applySplit', newRow)'
      });

      socket.on('flagBlock', function(flagOperation){
        // TODO: Grab the correct workspace using socket.workspace
        // TODO: Update the workspace object from mongo
        // TODO: Emit event with updated block flags using 'io.sockets.in(socket.workspace).emit('applyFlag', data)''
      });

      socket.on('moveBlock', function(moveOperation){
        // TODO: Same pattern as above operations
      });

      socket.on('addRow', function(addOperation){
        // TODO: Same pattern as above
        // TODO: Create mock row object, with the rawAudio as the filename sent in
        // Then, save that row and emit a new object
      });

      socket.on('removeRow', function(removeOperation){
        // TODO: Same pattern as above
      })

      // TODO: What other operations do we need to support? Adding a row? Does that happen here?
    });
  },
}

module.exports = socketObject;
