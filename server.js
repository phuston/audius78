var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var webpack = require('webpack');
var config = require('./webpack.config.js');
var injectTapEventPlugin = require('react-tap-event-plugin');
var app = express();

// Import socket handling
var sockets = require('./sockets/sockets');

// Import routes
var workspace = require( './routes/workspace');
var upload = require('./routes/upload.js')();

// Import database
var db = require('./db.js');

var isDev = process.env.NODE_ENV !== 'production';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false}));
app.use(cookieParser());

injectTapEventPlugin();

// Set up webpack for development environment
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

app.use('/api/workspace/', workspace);
app.post('/api/upload', upload.handleUpload);

var PORT = process.env.PORT || 3000;
var server = app.listen(PORT, function() {
  console.log('Application running on port:', PORT);
});

// Socket handling
sockets.socketServer(server);

module.exports = app;
