const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')//生成一个html，自动嵌入打包后的js和css

//同步获取指定路径下的所有文件名，自动跳过文件夹并递归获取,并且根据ext来筛选对应后缀名的文件
function getFile(PathName, ext, callback) {
    let files = fs.readdirSync(PathName)
    files.forEach(file => {
        const fileName = path.join(PathName, file)
        const stats = fs.statSync(fileName)
        //获取的是文件
        if (stats.isFile()) {
            if (path.extname(fileName) == `.${ext}`) {
                callback && callback(fileName)
            }
        }
        //获取的是文件夹就递归查询
        else if (stats.isDirectory()) {
            getFile(fileName, ext, callback)
        }
    })
}

const pagePATH = path.resolve(process.cwd(), 'src/page') //获取src路径下pages文件夹的绝对路径
let HTMLFILE = [] //pages目录下的所有html文件
let JSFILE = [] //pages目录下的所有js文件
getFile(pagePATH, 'html', fileName => HTMLFILE.push(fileName))
getFile(pagePATH, 'js', fileName => JSFILE.push(fileName))

let HTMLwebpack = []
let ENTRY = {}
//循环生成webpack入口对象，然后导出
JSFILE.forEach(item=>{
    ENTRY[path.basename(item, '.js')] = item
})
//循环生成HtmlWebpackPlugin插件的数组，然后导出
HTMLFILE.forEach(item => {
    let plugin = new HtmlWebpackPlugin({
        filename: path.basename(item),
        template: item,
        inject: true,
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
        },
        // alwaysWriteToDisk: true,
        chunks:['manifest', 'vendor', path.basename(item, '.html'), 'common'], //只插入对应名称的js入口模块，公共模块，第三方库和runtime
        chunksSortMode: 'dependency' //自动根据模块依赖来排序
    })
    HTMLwebpack.push(plugin)
})
module.exports = { HTMLwebpack: HTMLwebpack, ENTRY: ENTRY }
