const merge = require('webpack-merge')
const path = require('path')
const common = require('./webpack.base.js')

module.exports = merge(common, {
	devtool: 'eval-source-map',
	module:{
		rules:[
			{
				test: /\.css$/,//打包css
				use: [
					'style-loader',
					'css-loader',
					'postcss-loader'
				]
			},
			{
				test: /\.less$/,//打包less
				use: [{
					loader: 'style-loader'
				}, {
					loader: 'css-loader'
				}, {
					loader: 'less-loader',
					options: {
						strictMath: true,
						noIeCompat: true
					}
				}]
			}
		]
	},
	devServer: {
		contentBase: path.join(__dirname, ''),//当前是以项目根目录作为本地服务器根目录
		hot: true,
		inline: true,
		historyApiFallback: true,
		noInfo:true,//不显示打包的信息
		overlay: {//全屏显示错误和警告
			warnings: true,
			errors: true
		}
	}
})