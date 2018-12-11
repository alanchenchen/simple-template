const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const ROOTPATH = process.cwd() //获取进程的根绝对路径
const env = process.env.NODE_ENV //获取进程的模式是开发环境还是生产环境
const isProduction = env == 'production'

const HTMLwebpack = require('./queryFile').HTMLwebpack//自动获取所有的html并创建html-webpacj-plugin
const ENTRY = require('./queryFile').ENTRY//自动获取所有的js并创建入口
const CDNLibs = require('./config').CDNLibs

module.exports = {
	entry: ENTRY,
	output: {
		filename: 'static/js/[name].js',
		path: isProduction ? path.join(ROOTPATH, 'dist') : ROOTPATH,//打包输出的目录
		publicPath: isProduction ? './' : '/' //打包输出的html引用打包后文件夹的路径
	},
	module: { 
		rules: [
			{
				test: /\.(htm|html)$/i,//打包html内src的图片
				use: ['html-withimg-loader']
			},
			{
				test: /\.(png|gif|jpg|svg|jpeg)$/i,//打包css里图片
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192,
							name: '[name].[hash].[ext]',
							outputPath: 'static/img/' //图片文件打包后存放的路径
						}
					}
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,//打包css里字体
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192,
							name: '[name].[hash].[ext]',
							outputPath: 'static/fonts/' //字体文件打包后存放的路径
						}
					}
				]
			},
			{
				test: /\.js$/,//打包js，转码ES6+
				exclude: /(node_modules|bower_components)/,
				include: path.join(ROOTPATH, 'src'),
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env', 'stage-3']
					}
				}
			}
		]
	},
	plugins: [
			...HTMLwebpack,
			new CopyWebpackPlugin([
				{ 
					from: path.resolve(ROOTPATH, 'static'),
					to: path.resolve(ROOTPATH, 'dist/static'),
					ignore: ['.*']
				}
			]),
			// new HtmlWebpackHarddiskPlugin()
		],
	resolve: {
		alias: {
			'@': path.resolve(ROOTPATH, 'src'),
			'component': path.resolve(ROOTPATH, 'src/component'),
			'static': path.resolve(ROOTPATH, 'static') 
		},
		extensions: ['.js', '.json', '.css', '.less', '.styl']
	},
	externals:CDNLibs
}