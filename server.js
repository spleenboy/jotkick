var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

var server = new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    stats: {colors: true},
});

server.listen(config.output.port, config.output.domain, function(err) {
    if (err) {
        console.error("Error listening", err);
    }
    console.log('Listening at localhost:3000');
});
