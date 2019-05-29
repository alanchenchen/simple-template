const webpack = require('webpack')
const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')//压缩混淆
const CleanWebpackPlugin = require('clean-webpack-plugin')//清除打包后的重复chunk
const common = require('./webpack.base.js')
const ROOTPATH = process.cwd() //获取进程的根绝对路径
const sourceMap = require('./config').prod.sourceMap

const ExtractTextPlugin = require('extract-text-webpack-plugin')//提取独立css文件
const extractCSS = new ExtractTextPlugin({filename: 'static/style/[name].[contenthash].css', allChunks: true})
const extractLESS = new ExtractTextPlugin({filename: 'static/style/[name].[contenthash].css', allChunks: true})
const extractSTYLUS = new ExtractTextPlugin({filename: 'static/style/[name].[contenthash].css', allChunks: true})

module.exports = merge(common, {
	devtool: 'source-map',
	output: {
		filename: 'static/js/[name].[chunkhash].js',
		chunkFilename: 'static/js/[name].[chunkhash].js'
	},	
	module: {
		rules: [
			{
				test: /\.css$/,//打包css
				use: extractCSS.extract({
						publicPath: '../../', //打包后css文件中引入图片和字体的相对路径，此时为dist根目录
						use: [
							{
								loader: 'css-loader',
								options: {
									minimize: true,
									sourceMap
								}
							},
							'postcss-loader']
					})
			},
			{
				test: /\.less$/i,//打包less
				use: extractLESS.extract({
						publicPath: '../../', //打包后css文件中引入图片和字体的相对路径，此时为dist根目录
						use: [
							{
								loader: 'css-loader',
								options: {
									minimize: true,
									sourceMap
								}
							},
							'postcss-loader',
							'less-loader']
					})
			},
			{
				test: /\.styl$/i,//打包stylus
				use: extractSTYLUS.extract({
						publicPath: '../../', //打包后css文件中引入图片和字体的相对路径，此时为dist根目录
						use: [
							{
								loader: 'css-loader',
								options: {
									minimize: true,
									sourceMap
								}
							},
							'postcss-loader',
							'stylus-loader']
					})
			}
		]
	},	
	plugins: [ 
		extractCSS,
		extractLESS,
		extractSTYLUS,
		new CleanWebpackPlugin('dist', { root: ROOTPATH, verbose: false }), //每次打包都会清除dist目录
		new UglifyJSPlugin({ //压缩混淆代码，并且生成sourceMap调试
			uglifyOptions: {
				compress: true,
				ecma: 8,//支持ECMA 8语法
				warnings: false//去掉警告
			},
			sourceMap
		}),
		new webpack.DefinePlugin({ //添加node进程环境为production环境，方便第三方库打包。减少不必要的代码
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		new webpack.HashedModuleIdsPlugin(), //给每个chunk添加一个hashID
		// 注意CommonsChunkPlugin使用的顺序，很重要，先提取所有第三方模块和npm包，再从提取出来的chunks里提取npm包，最后从npm的chunks里提取runtime文件
		new webpack.optimize.CommonsChunkPlugin({ // 提取第三方公共模块，不是从node_modules引入，仅当被超过两个页面js引入才抽出common的chunk
			name: "common",
			minChunks: function(module, count){
				const trigger = (module.resource  && module.resource.includes("component") && count >= 2) || module.context && module.context.includes("node_modules")
				return trigger
			}
		}),
		new webpack.optimize.CommonsChunkPlugin({ //提取所有被require的npm包，从node_modules引入
			name: "vendor",
			minChunks: function(module){
				return module.context && module.context.includes("node_modules")
			}
		}),
		new webpack.optimize.CommonsChunkPlugin({ //提取webpack的runtime到公共模块
			name: "manifest",
			minChunks: Infinity
		})
	]
})