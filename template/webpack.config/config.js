module.exports = {
    dev: {
        host: 'localhost', //开发模式本地服务器的ip
        useIPv4: false, //是否开启自动获取本机的IPv4地址，因为webpack-dev-server默认不能局域网访问，开启会覆盖host
        port: 8080, //开发模式本地服务器的端口,如果发现被占用会自动重写
        autoOpenBrowser: false, //开发模式本地服务器是否自动打开首页
        //webpack的代理服务器功能，可以实现本地开发跨域请求，原理是运用了http-proxy-middleware中间件
        proxy: {}  
    },
    prod: { //不管是否开启,css都会生成sourceMap
        sourceMap: false
    },
    
    CDNLibs:{ //需要模块引入的第三方cdn库,必须先引入cdn！否则会报错
        //键是你想设置的模块名，值是引入的插件本身暴露在windows下的对象名
        // 'jq':'jQuery'
    }
}
  