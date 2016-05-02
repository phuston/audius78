var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var webpack = require('webpack');
var config = require('./webpack.config.js');
var workspace = require( './routes/workspace');
var app = express();
var index =require('./routes/index.js')();
var db = require('./db.js');
var injectTapEventPlugin = require('react-tap-event-plugin');


var isDev = process.env.NODE_ENV !== 'production';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false}));
app.use(cookieParser());

injectTapEventPlugin();

if(isDev) {
  var webpackMiddleware = require('webpack-dev-middleware');
  var webpackHotMiddleware = require('webpack-hot-middleware');

  console.log("In Development Mode");
  const compiler = webpack(config);
  app.use(webpackMiddleware(compiler, 
    {
      stats: {
        colors: true,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        modules: false
      }
    }
  ));
  app.use(webpackHotMiddleware(compiler, {
    log: console.log, path: '/__webpack_hmr', heartbeat: 10*1000
  }));
}

app.use(express.static(path.join(__dirname, '/public')));  
app.use(express.static(path.join(__dirname, '/static')));  

app.use('/workspace/', workspace);
app.post('/api/upload', index.upload);

var PORT = process.env.PORT || 3000;
var server = app.listen(PORT, function() {
  console.log('Application running on port:', PORT);
});

// Socket.IO Port
var sockets = require('./sockets');
sockets.socketServer(server);

module.exports = app;
