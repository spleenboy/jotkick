var path = require('path');
var webpack = require('webpack');
var babelfill = require('babel-polyfill');

module.exports = {
    entry: [
        './src/app.js'
    ],
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js',
        port: 3000,
        domain: 'localhost',
        publicPath: 'build/'
    },
    plugins: [],
    module: {
        loaders: [
            {
                test: /\.js?$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: require.resolve('react'),
                loader: 'expose?React'
            },
            {
                test: /\.css$/,
                loader: 'style!css?sourceMap'
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg|png|jpg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    node: {
        'fs': 'empty'
    }
};
