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
const templatePATH = path.resolve(process.cwd(), 'template')//获取tempalte文件夹的绝对路径
const JSPATH = path.resolve(process.cwd(), 'src/components')//获取src路径下components文件夹的绝对路径
let HTMLFILE = []//tempalte目录下的所有html文件
let JSFILE = []//components目录下的所有js文件
getFile(templatePATH, 'html', fileName => HTMLFILE.push(fileName))
getFile(JSPATH, 'js', fileName => JSFILE.push(fileName))

let HTMLwebpack = []
let ENTRY = {}
//循环生成webpack入口对象，然后导出
JSFILE.forEach(item=>{
    ENTRY[path.parse(item).name] = item
})
//循环生成HtmlWebpackPlugin插件的数组，然后导出
HTMLFILE.forEach(item => {
    let plugin = new HtmlWebpackPlugin({
        filename: path.basename(item),
        template:  item,
        inject: true,
        chunks:[path.parse(item).name]//只插入对应名称的js打包文件
    })
    HTMLwebpack.push(plugin)
})
module.exports = { HTMLwebpack: HTMLwebpack, ENTRY: ENTRY }