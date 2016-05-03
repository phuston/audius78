var mongoose = require('mongoose');

var isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
	mongoose.connect('mongodb://localhost/audius78');
	console.log('Connected to local database');
} else {
	mongoose.connect('mongodb://audius78:audius78@ds023490.mlab.com:23490/audius78');
	console.log('Connected to MongoLab');
}

var connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function(){
    console.log('Mongodb Connection Successful');
});
