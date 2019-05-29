const merge = require('webpack-merge')
const webpack = require('webpack')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')//报错友好提示插件
const portFinder = require('portfinder') //用来获取可用port的node模块
const common = require('./webpack.base.js')

const useIPv4 = require('./config').dev.useIPv4
const devHost = require('./config').dev.host
const devPort = require('./config').dev.port
const proxy = require('./config').dev.proxy
const autoOpenBrowser  = require('./config').dev.autoOpenBrowser

//通过os模块动态获取当前本机的局域网IP，然后更改webpack-dev-server的host地址，解决localhost无法被局域网访问的问题
function GetIPv4_IP() {
	const os = require('os')
	const network = os.networkInterfaces().WLAN
	const IPv4_Ip = network.filter(a => a.family == 'IPv4')[0].address
	return IPv4_Ip
}

const host = useIPv4
			? GetIPv4_IP()
			: devHost

const devConfig = (port) =>{
	return merge(common, {
		devtool: 'cheap-module-eval-source-map',
		module: {
			rules: [
				{
					test: /\.css$/,//打包css
					use: ['style-loader', 'css-loader', 'postcss-loader']
				},
				{
					test: /\.less$/i,//打包less
					use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
				},
				{
					test: /\.styl$/i,//打包stylus
					use: ['style-loader', 'css-loader', 'postcss-loader', 'stylus-loader']
				}
			]
		},	
		devServer: {
			clientLogLevel: 'warning',
			contentBase: process.cwd(),//当前是以dist目录作为本地服务器根目录
			host,
			port,
			open: autoOpenBrowser,
			hot: true,
			// watchContentBase: true,
			compress: true, //压缩开启
			historyApiFallback: {
				rewrites: [ //将/路径重写跳转到index.html
					{ from: /^\/$/, to: '/index.html' }
				]
			},
			quiet: true, //ErrorFriendly模块要求,开发环境打包出错不会出现打包信息
			noInfo: true,//不显示打包的信息
			overlay: {//全屏显示错误和警告
				warnings: true,
				errors: true
			},
			proxy
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin(), //热替换
			new webpack.NamedModulesPlugin(), //准确打印出当前热更新的文件名称
			new FriendlyErrorsWebpackPlugin({
				compilationSuccessInfo: {
					messages: [`Your application is running at http://${host}:${port}`],
				}
			})
		]
	})
}

module.exports = () => {
	return new Promise((resolve, reject) => {
		portFinder.basePort = devPort
		portFinder.getPortPromise()
			.then( freePort => {
				resolve(devConfig(freePort))
			})
			.catch(err => {
				console.log(err)
				reject(err)
			})
	})
}