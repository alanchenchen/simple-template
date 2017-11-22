const webpack = require('webpack')
const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')//压缩混淆
const common = require('./webpack.base.js')

module.exports = merge(common, {
	plugins: [
		new UglifyJSPlugin({//压缩混淆代码，并且生成sourceMap调试
			uglifyOptions: {
				ecma: 8,//支持ECMA 8语法
				warnings: false//去掉警告
			},
			sourceMap: true
		}),
		new webpack.DefinePlugin({//添加node进程环境为production环境，方便第三方库打包。减少不必要的代码
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		})
	]
})
