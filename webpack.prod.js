const webpack = require('webpack')
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')//提取独立文件
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')//压缩混淆
const common = require('./webpack.base.js')
const extractCSS = new ExtractTextPlugin('style/[name]-css.css')
const extractLESS = new ExtractTextPlugin('style/[name]-less.css')

module.exports = merge(common, {
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.css$/,
				use: extractCSS.extract(['css-loader', 'postcss-loader'])
			},
			{
				test: /\.less$/i,
				use: extractLESS.extract(['css-loader', 'less-loader'])
			}
		]
	},
	plugins: [
		new UglifyJSPlugin({//压缩混淆代码，并且生成sourceMap调试
			uglifyOptions: {
				ecma: 8,//支持ECMA 8语法
				warnings: false//去掉警告
			},
			sourceMap: true
		}),
		extractCSS,//将css打包成一个独立的css文件
		extractLESS,//将less打包成一个独立的css文件
		new webpack.DefinePlugin({//添加node进程环境为production环境，方便第三方库打包。减少不必要的代码
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		})
	]
})
