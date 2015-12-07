var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        'babel-polyfill',
        './src/app.js'
    ],
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '/build/'
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
                test: /\.css?$/,
                loader: 'style|css'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};
