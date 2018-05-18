module.exports = {
    dev: {
        host: 'localhost', //开发模式本地服务器的ip
        port: 8080, //开发模式本地服务器的端口,如果发现被占用会自动重写
        autoOpenBrowser: false //开发模式本地服务器是否自动打开首页
    },
    prod: { //jsSourceMap权限更高。如果jsSourceMap为true，js和css都会生成sourceMap
        cssSourceMap: true,
        jsSourceMap: false
    },
    //需要模块引入的第三方库,必须先引入cdn！否则会报错
    vendors:{
        //键是你想设置的模块名，值是引入的插件本身暴露在windows下的对象名
//         'jquery':'jQuery'
    }
}
 