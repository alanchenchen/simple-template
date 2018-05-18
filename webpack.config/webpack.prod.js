const webpack = require('webpack')
const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')//压缩混淆
const CleanWebpackPlugin = require('clean-webpack-plugin')//清除打包后的重复chunk
const common = require('./webpack.base.js')
const ROOTPATH = process.cwd() //获取进程的根绝对路径
const jsSourceMap = require('./config').prod.jsSourceMap

module.exports = merge(common, {
	plugins: [ 
		new CleanWebpackPlugin('dist', { root: ROOTPATH }),//每次打包都会清除dist目录...
		new UglifyJSPlugin({//压缩混淆代码，并且生成sourceMap调试
			uglifyOptions: {
				ecma: 8,//支持ECMA 8语法
				warnings: false//去掉警告
			},
			sourceMap: jsSourceMap
		}),
		new webpack.DefinePlugin({//添加node进程环境为production环境，方便第三方库打包。减少不必要的代码
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		})
	]
})