var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var precss       = require('precss');

module.exports = {
    entry: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
        './client/Router.jsx'],
    output: {
        //path: path.join(__dirname, '/public/'),
        path: __dirname,
        publicPath: '/',
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    module: {
        loaders: [
        {
            //tell webpack to use jsx-loader for all *.jsx files
            test: [/\.js$/,/\.jsx$/],
            exclude: '/node_modules/',
            loader: 'babel-loader',
            query: {
                cacheDirectory: true,
                presets: ['react', 'es2015']
            }
        },
        {
            test:   [/\.css$/, /\.scss$/],
            //loader: ['style-loader','css-loader','postcss-loader', 'sass']
            loaders: ['style','css','postcss-loader', 'sass']
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.scss', '.css']
    },
    postcss: function () {
        return [autoprefixer, precss];
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
};
