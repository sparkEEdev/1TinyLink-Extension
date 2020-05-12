const path = require('path')
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: {
        content: path.resolve(__dirname, 'src', 'content.ts'),
        popup: path.resolve(__dirname, 'src', 'popup.ts'),
        background: path.resolve(__dirname, 'src', 'background.ts'),
        "content/formIFrame": path.resolve(__dirname, 'src', 'content/formIFrame.ts'),
        "content/responseIFrame": path.resolve(__dirname, 'src', 'content/responseIFrame.ts'),
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            }
        ]
    },
    resolve: {
        modules: [
            path.resolve(__dirname, 'src')
        ],
        extensions: ['.js', '.ts']
    },
    plugins: [
        new Dotenv(),
        new CopyPlugin([
            { from: './manifest.json', to: 'manifest.json', force: true },
            { from: './images', to: 'images' },
            { from: './src/popup.html', to: 'popup.html', force: true },
            { from: './src/resources/css', to: 'resources/css', force: true },
            { from: './src/content/formIFrame.html', to: 'content/formIFrame.html', force: true },
            { from: './src/content/responseIFrame.html', to: 'content/responseIFrame.html', force: true }
        ]),
    ]
}
