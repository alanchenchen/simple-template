const merge = require('webpack-merge')
const common = require('./webpack.base.js')

module.exports = merge(common, {
	devServer: {
		contentBase: process.cwd(),//当前是以项目根目录作为本地服务器根目录
		port: 3000,
		hot: true,
		inline: true,
		openPage: 'dist/index.html',
		historyApiFallback: true,
		noInfo: true,//不显示打包的信息
		overlay: {//全屏显示错误和警告
			warnings: true,
			errors: true
		}
	}
})