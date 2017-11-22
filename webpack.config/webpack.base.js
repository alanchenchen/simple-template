const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')//清除打包后的重复chunk
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')//报错友好提示插件
const HtmlWebpackPlugin = require('html-webpack-plugin')//生成一个html，自动嵌入打包后的js和css
const HTMLwebpack = require('./queryFile').HTMLwebpack//自动获取所有的html并创建html-webpacj-plugin
const ENTRY = require('./queryFile').ENTRY//自动获取所有的js并创建入口
const ROOTPATH = process.cwd()
const env = process.env.NODE_ENV //获取进程的模式是开发环境还是生产环境
const ExtractTextPlugin = require('extract-text-webpack-plugin')//提取独立文件
const extractCSS = new ExtractTextPlugin('static/style/[name]-css.css')
const extractLESS = new ExtractTextPlugin('static/style/[name]-less.css')
const extractSTYLUS = new ExtractTextPlugin('static/style/[name]-stylus.css')

module.exports = {
	devtool: env == 'production' ? 'source-map' : 'eval-source-map',
	entry: ENTRY,
	output: {
		filename: 'static/js/[name].bundle.js',
		path: path.join(ROOTPATH, 'dist'),//打包输出的目录
		publicPath: env == 'production' ? '../dist/' : '/dist/'
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
							outputPath: 'static/img/',
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
						presets: ['es2015', 'latest', 'env']
					}
				}
			},
			{
				test: /\.css$/,//打包css
				use: env == 'production' ?
					extractCSS.extract({
						publicPath: '../../',
						use: [
							{
								loader: 'css-loader',
								options: {
									minimize: true
								}
							},
							'postcss-loader']
					})
					: ['style-loader', 'css-loader', 'postcss-loader']
			},
			{
				test: /\.less$/,//打包less
				use: env == 'production' ?
					extractLESS.extract({
						publicPath: '../../',
						use: [
							{
								loader: 'css-loader',
								options: {
									minimize: true
								}
							},
							'less-loader']
					})
					: ['style-loader', 'css-loader', 'less-loader']
			},
			{
				test: /\.styl$/,//打包stylus
				use: env == 'production' ?
					extractSTYLUS.extract({
						publicPath: '../../',
						use: [
							{
								loader: 'css-loader',
								options: {
									minimize: true
								}
							},
							'stylus-loader']
					})
					: ['style-loader', 'css-loader', 'stylus-loader']
			}
		]
	},
	plugins: env == 'production' ? [
		new CleanWebpackPlugin('dist', { root: ROOTPATH }),//每次启动都会清除dist目录...
		new FriendlyErrorsWebpackPlugin(),
		extractCSS,
		extractLESS,
		extractSTYLUS,
		...HTMLwebpack
	]
		: [
			new CleanWebpackPlugin('dist', { root: ROOTPATH }),//每次启动都会清除dist目录...
			new FriendlyErrorsWebpackPlugin(),
			...HTMLwebpack,
		],
	resolve: {
		alias: {
			'@': path.resolve(ROOTPATH, 'src')
		}
	}
}
