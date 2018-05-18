const path = require('path')
const ROOTPATH = process.cwd() //获取进程的根绝对路径
const env = process.env.NODE_ENV //获取进程的模式是开发环境还是生产环境
const isProduction = env == 'production'

const ExtractTextPlugin = require('extract-text-webpack-plugin')//提取独立css文件
const extractCSS = new ExtractTextPlugin('static/style/[name]-css.css')
const extractLESS = new ExtractTextPlugin('static/style/[name]-less.css')
const extractSTYLUS = new ExtractTextPlugin('static/style/[name]-stylus.css')

const HTMLwebpack = require('./queryFile').HTMLwebpack//自动获取所有的html并创建html-webpacj-plugin
const ENTRY = require('./queryFile').ENTRY//自动获取所有的js并创建入口
const vendors = require('./config').vendors
const cssSourceMap = require('./config').prod.cssSourceMap

module.exports = {
	devtool: isProduction ? 'source-map' : 'eval-source-map',
	entry: ENTRY,
	output: {
		filename: 'static/js/[name].bundle.js',
		path: path.join(ROOTPATH, 'dist'),//打包输出的目录
		publicPath: isProduction ? './' : '/dist/' //打包输出的html引用打包后dist文件夹的路径
	},
	module: {
		rules: [
			{
				test: /\.(htm|html)$/i,//打包html内src的图片
				use: ['html-withimg-loader']
			},
			{
				test: /\.(png|gif|jpg|svg|jpeg|woff|woff2|eot|ttf|otf)$/i,//打包css里图片和字体
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192,
							name: '[name]-[hash:6].[ext]',
							outputPath: 'static/img/', //图片和字体文件打包后存放的路径
						}
					}
				]
			},
			{
				test: /\.js$/,//打包js，转码ES6
				exclude: /(node_modules|bower_components)/,
				include: path.join(ROOTPATH, 'src'),
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env', 'stage-3']
					}
				}
			},
			{
				test: /\.css$/,//打包css
				use: isProduction 
				? extractCSS.extract({
						publicPath: '../../', //打包后css文件中引入图片和字体的相对路径，此时为dist根目录
						use: [
							{
								loader: 'css-loader',
								options: {
									minimize: true
								}
							},
							'postcss-loader']
					})
				: ['style-loader', 
					{
						loader: 'css-loader',
						options: {
							sourceMap: cssSourceMap
						}
					}, 
					'postcss-loader']
			},
			{
				test: /\.less$/,//打包less
				use: isProduction 
				? extractLESS.extract({
						publicPath: '../../', //打包后css文件中引入图片和字体的相对路径，此时为dist根目录
						use: [
							{
								loader: 'css-loader',
								options: {
									minimize: true
								}
							},
							'less-loader']
					})
				: ['style-loader', 
					{
						loader: 'css-loader',
						options: {
							sourceMap: cssSourceMap
						}
					},  
					'less-loader']
			},
			{
				test: /\.styl$/,//打包stylus
				use: isProduction 
				? extractSTYLUS.extract({
						publicPath: '../../', //打包后css文件中引入图片和字体的相对路径，此时为dist根目录
						use: [
							{
								loader: 'css-loader',
								options: {
									minimize: true
								}
							},
							'stylus-loader']
					})
				: ['style-loader', 
					{
						loader: 'css-loader',
						options: {
							sourceMap: cssSourceMap
						}
					}, 
					'stylus-loader']
			}
		]
	},
	plugins: isProduction 
		? [
			extractCSS,
			extractLESS,
			extractSTYLUS,
			...HTMLwebpack
		]
		: [
			...HTMLwebpack,
		],
	resolve: {
		alias: {
			'@': path.resolve(ROOTPATH, 'src')
		}
	},
	externals:vendors
}
