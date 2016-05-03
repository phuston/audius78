var path = require('path');
var autoprefixer = require('autoprefixer');
var precss       = require('precss');
var webpack = require('webpack');

module.exports = {
  entry: './client/router.jsx',
  output: {
    path: path.join(__dirname, '/public/'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [ 
    {
      //tell webpack to use jsx-loader for all *.jsx files
      test: [/\.js$/,/\.jsx$/],
      exclude: '/node_modules/',
      loader: 'babel-loader',
      query: {
        cacheDirectory: true,
        presets: ['react', 'es2015', 'stage-2']
      }
    },
    {
      test:   [/\.css$/, /\.scss$/],
      loaders: ['style','css','postcss-loader', 'sass']
    },

    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss', '.css']
  },
  postcss: function () {
    return [autoprefixer, precss];
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    })
  ]
};
