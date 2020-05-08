const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-soure-map',
    devServer: {
        contentBase: './dist',
    },
});