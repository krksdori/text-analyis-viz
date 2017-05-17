
const path = require('path');
const webpack = require('webpack');



const dist = path.resolve(__dirname, '../dist');
const publicPath = path.resolve(__dirname, '../public');

module.exports = {
    devtool: "source-map",
    entry: [
		'./src/index.js'
    ],
    output: {
        filename: 'bundle.js',
    },
	devServer: {
	    hot: true,
        contentBase: publicPath,
        compress: true,
        port: 3000,
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
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            },
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
    ]

};