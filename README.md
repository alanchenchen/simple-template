# template
different templates for webpack-config.
* 主要用来给自己写的简易脚手架提供不同的webpack模板
## 这一个模板集成了本地开发服务器和上线压缩混淆功能，只是一个非常简单的用来处理非MMVM框架的单页面webpack模板
* 目前只提供了css，less和postcss等loader来解析样式，本地开发不会提取单独样式，而打包上线会提取单独的css文件并且生成source-map供调试
* js只提供了基本的babel-loader来转码es6/7/8等语法，打包上线会混淆压缩js，也会生成source-map供调试，而开发环境提供了eval-source-map供调试，提高了调试的易用性
* 也提供了打包图片和字体的loader，在引入iconfont的时候需要手动改iconfont.css的路径为相对路径并且删掉引号
* 开发环境需要注意，自己在index.html引入js的时候，必须用绝对路径dist加上[name].bundle.js。而生产模式会自动生成index.html并且嵌入link和script标签，生产环境打包之后的所有资源都会放在dist文件夹。
* 开发环境自动开启热更新和热替换，并且提供了和vue-cli相同的错误提示命令行提示界面

`注意`
* 目前不提供自动根据模板和js文件改变entry入口配置，所以，如果你需要打包多个html和js，请手动更改entry和html-webpack-plugin。
* 建议index.html放在项目根目录，这样本地服务器不会出错，建议源码放在src目录，src位于根目录，和html同级
* 根目录的index.html只是用来在开发环境提供预览，在生成环境打包之后，dist里的index.html才是需要放到线上的
## 使用：
* 1.git clone https://github.com/alanchenchen/simple-template.git
* 2.npm install 
* 3.在根目录新建index.html(单页面入口)和src目录，然后根据需要，自己手动更改webpack.base.js里的entry(js打包的入口)和wtml-webpack-plugin(生成html的插件入口),如果开发的是单页面，则不要更改配置，只需要在index.html里写上script,路径是'dist/[js的name].bundle.js'
* 4.在src里写js，css和加入需要打包的字体
* 5.npm run dev --启动开发环境，会自动打开浏览器，更改js或css代码，浏览器会热替换，请注意html模板内的内容改变浏览器不会刷新
* 6.npm run build --启动生成环境，打包src内的资源，生成以根目录html文件为模板的资源，所有资源都放在dist目录内(打包之后的文件路径都是绝对路径，直接打开会报错，只能放在服务器内打开！！)