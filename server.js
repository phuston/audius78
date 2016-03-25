var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var webpack = require('webpack');
var config = require('./webpack.config.js');

var isDeveloping = process.env.NODE_ENV !== 'production';

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false}));
app.use(cookieParser());

if(isDeveloping) {
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

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log('Application running on port:', PORT);
});

module.exports = app;
