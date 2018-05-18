const merge = require('webpack-merge')
const webpack = require('webpack')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')//报错友好提示插件
const portFinder = require('portfinder') //用来获取可用port的node模块
const common = require('./webpack.base.js')
const host = require('./config').dev.host
const port = require('./config').dev.port
const autoOpenBrowser  = require('./config').autoOpenBrowser

const devConfig = (port) =>{
	return merge(common, {
		devServer: {
			clientLogLevel: 'warning',
			contentBase: process.cwd(),//当前是以项目根目录作为本地服务器根目录
			host,
			port,
			open: autoOpenBrowser,
			hot: true,
			compress: true, //压缩开启
			historyApiFallback: {
				rewrites: [ //将/路径重写跳转到dist/index.html
					{ from: /^\/$/, to: '/dist/index.html' },
				]
			},
			quiet: true, //ErrorFriendly模块要求,开发环境打包出错不会出现打包信息
			noInfo: true,//不显示打包的信息
			overlay: {//全屏显示错误和警告
				warnings: true,
				errors: true
			}
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin(), //热替换
			new webpack.NamedModulesPlugin(), //准确打印出当前热更新的文件名称
			new FriendlyErrorsWebpackPlugin({
				compilationSuccessInfo: {
					messages: [`You application is running at http://${host}:${port}`],
				}
			})
		]
	})
}

module.exports = () => {
	return new Promise((resolve, reject) => {
		portFinder.basePort = port
		portFinder.getPortPromise()
			.then(freePort => {
				resolve(devConfig(freePort))
			})
			.catch(err => {
				console.log(err)
			})
	})
}