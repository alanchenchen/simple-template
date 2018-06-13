# simple-template
A simple  template with webpack for building mutiple entries project
> Author：Alan Chen
> E-mail: 739709491@qq.com
### 这一个模板集成了本地开发服务器和上线压缩混淆功能，用来处理非MvvM框架的多页面webpack模板
* 提供css、less、postcss和stylus等loader来解析样式，本地开发不会提取单独样式，而打包上线会提取单独的css文件并且生成source-map供调试
* 提供babel-loader来转码ES6/7/8等语法，提供babel-plugin-transform-runtime来转码最新的ES语法，支持stage3的提案语法。打包上线会混淆压缩js，可选生成source-map供调试，而开发环境提供了cheap-module-eval-source-map供调试，提高了调试的易用性
* 提供url-loader打包图片和字体，在引入iconfont的时候需要手动改iconfont.css的路径为相对路径并且删掉引号
* 提供cdn库模块引入功能，对应webpack的externals选项。
* 开发环境自动开启热更新和热替换,可选自动打开index.html，并且提供了和vue-cli相同的错误提示命令行提示界面
* 开发环境提供http-proxy来代理服务器，解决开发时跨域问题
* 开发环境端口会自动解决占用问题，例如8080端口被占用，此时本地服务器会寻找8081或其余自由的端口
* 开发环境ip地址支持设置为本机局域网ip，解决localhost无法被局域网访问的问题
* 生产环境支持代码切割、缓存和懒加载功能，多页面引入同一包不会重复打包。拆分vendor和manifest公共chunk，添加hash缓存，提高重复打包效率
* 提供自动根据多入口来打包的功能，方便开发，自动根据同名的html和js按需打包，按需插入资源。
* 为避免产品上线由于后端没有把项目放在服务器根目录导致路径错误问题，本模板默认资源路径全部为相对路径！(publicPath是个神坑...)

`注意`
* 根目录里的src和template文件夹不能删除！src下的commopents文件夹也不能删除！建议就按照模板的目录来开发，js和css为一个组件，而且，必须保证template下存在index.html和components下有index.js，必须保证html和需要打包的js同名
* (解释)因为必须要让webpack知道打包哪些入口js，必须要让插件知道哪些js需要嵌入在对应的html里，所以本模板规定src内的comopennts下写组件的文件夹，组件名和html名对应，组件文件夹内js必须与组件同名，css随意。建议全部同名
* 模板给出的目录，src为源码，template为html，src下，assets为图片和字体等资源，common为公共的js和css。components为需要打包的资源。最终webpack只会打包html和与html文件名一致的js文件
* 开发时不要在html里写link和sript标签，插件会自动插入css和js。生产模式会自动生成html并且嵌入link和script标签，打包之后的所有资源都会放在dist文件夹。
* 根目录的index.html只是用来在开发环境提供预览，在生成环境打包之后，dist里的index.html才是需要放到线上的
* 当需要在js里输入template里的html路径时，直接输入绝对路径即可。例如：'test.html',无论是开发环境还是生产环境都会默认指向生成的test.html！
## 使用：
> 强烈建议通过我仓库内的[alan-cli](https://github.com/alanchenchen/alan-cli)来使用，非常便捷！
* 1.git clone https://github.com/alanchenchen/simple-template.git
* 2.npm install 
* 3.npm run dev 或者npm start  --启动开发环境，默认不会自动打开浏览器，更改js或css代码，浏览器会热替换，请注意html模板内的内容改变浏览器不会刷新
* 4.npm run build --启动生产环境，打包components内的js文件，生成以html文件为模板的资源，所有资源都放在dist目录内(打包之后的文件路径全改为相对路径,可以直接打开！！)
* 5.可以在webpack.config文件夹下的config.js里修改配置，提供了大量可修改配置。
* 6.本模板提供externals和公共chunk拆分两种可选功能，但还是建议第三方库引入cdn而不是通过npm包引入，否则会让打包后文件非常大。设置externals只需先在相关页面里引入script，然后在config.js配置，就可以在js里把cdn插件当作模块引入。<span style="color:red;font-weight:bold">修改config里的东西一定要重新打开本地服务器！</span>
* 7.如果想使用css预编译工具，目前模板支持less和stylus等loader，但是，你必须要自己手动npm安装对应的预编译工具，例如`npm install --save-dev stylus`
