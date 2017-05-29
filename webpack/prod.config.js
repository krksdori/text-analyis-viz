const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devtool: false,
    entry: {
        'dist': './src/index.js',
    },
    output: {
        path: './',
        filename: 'dist/[name].js',
    },
    module:{
        rules:[
            {
                test: /\.(png|jpg|woff|woff2|eot|otf|ttf|svg)$/,
                use: [
                    'url-loader'
                ]
            },
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
			},
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'postcss-loader'
                    ]
                })
            },
        ],
    },
    plugins: [
        new ExtractTextPlugin("dist/mindmap.css"),
    ]
};