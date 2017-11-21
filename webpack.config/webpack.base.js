const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')//清除打包后的重复chunk
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')//报错友好提示插件
const HtmlWebpackPlugin = require('html-webpack-plugin')//生成一个html，自动嵌入打包后的js和css
const HTMLwebpack = require('./queryFile').HTMLwebpack//自动获取所有的html并创建html-webpacj-plugin
const ENTRY = require('./queryFile').ENTRY//自动获取所有的js并创建入口
const ROOTPATH = process.cwd()

module.exports = {
	entry: ENTRY,
	output: {
		filename: 'js/[name].bundle.js',
		path: path.join(ROOTPATH, 'dist'),//打包输出的目录
		publicPath: '/dist/'//打包后资源或者本地服务器打包后输出的目录，建议html和css所有资源加载以该目录为绝对路径
	},
	module: {
		rules: [
			{
				test: /\.(htm|html)$/i,//打包html内src的图片
				use:['html-withimg-loader']
			},
			{
				test: /\.(png|gif|jpg|svg|jpeg|woff|woff2|eot|ttf|otf)$/i,//打包css里图片和字体
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192,
							name: 'img/[name]-[hash:6].[ext]'
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
						presets: ['es2015', 'latest','env']
					}
				}
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin('dist',{root:ROOTPATH}),//每次启动都会清除dist目录...
		new FriendlyErrorsWebpackPlugin(),
		...HTMLwebpack
	],
	resolve:{
		alias:{
			'@':path.resolve(ROOTPATH,'src')
		}
	}
}
