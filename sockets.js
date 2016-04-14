var socketIO = require('socket.io');

var socketObject = {
	socketServer: function (server) {
		var io = socketIO.listen(server);

		io.sockets.on('connection', function(socket) {
		  console.log('connected');

		  socket.on('newWorkspace', function (hashCode) {
				console.log('newWorkspace');
				var nsp = io.of('/'+hashCode);
				socket.emit('workspaceCreated');
				nsp.on('connection', function(socket) {
					console.log('connected to', hashCode);
				});
			});
		});

		
	},

	// createNamespace: function (hashCode) {
		
	// }
}

module.exports = socketObject;