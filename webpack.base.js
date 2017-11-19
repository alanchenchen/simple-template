const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')//清除打包后的重复chunk
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')//报错友好提示插件
const HtmlWebpackPlugin = require('html-webpack-plugin')//生成一个html，自动嵌入打包后的js和css

module.exports = {
	entry: {
		es6: path.resolve(__dirname, 'src/js/es6')
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),//打包输出的目录
		publicPath: '/dist/'//打包后资源或者本地服务器打包后输出的目录，建议html和css所有资源加载以该目录为绝对路径
	},
	module: {
		rules: [
			{
				test: /\.(png|gif|jpg|svg|jpeg|woff|woff2|eot|ttf|otf)$/i,//打包图片和字体
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
				include: path.resolve(__dirname, 'src'),
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
		new CleanWebpackPlugin(['dist']),//每次启动都会清除dist目录...
		new FriendlyErrorsWebpackPlugin(),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './index.html',
			inject: true
		}),
	]
}