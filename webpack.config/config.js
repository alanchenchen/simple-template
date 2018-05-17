//此处设置devServer的端口和需要模块引入的第三方库,注意：如果想模块引入，必须先引入cdn！否则会报错
module.exports = {
    host: 'localhost'
    port:8080,
    autoOpen: false,
    //并且需要设置别名和插件内挂载在windows对象上的别名
    vendors:{
        //键是你想设置的模块名，值是引入的插件本身暴露在windows下的对象名
//         'jquery':'jQuery'
    }
}
