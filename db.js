var mongoose = require('mongoose');

//mongoose.connect('mongodb://olinjs:wiki@ds017688.mlab.com:17688/wikipages');
mongoose.connect('mongodb://audius78:audius78@ds023490.mlab.com:23490/audius78');
var connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function(){
    console.log('Mongodb Connection Successful');
});
