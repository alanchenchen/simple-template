# simple-template
A template with webpack for building mutiple entries project
> Author：Alan Chen

> E-mail: 739709491@qq.com

> version: 1.3.2

## Update log
1. 重新优化目录结构，更加符合中大型项目的组件化开发要求
2. 智能抽离公共模块，除了拆分第三方库外，还会拆分开发者引入自己写的模块
3. 新增支持`import()`语法，可以实现动态引入模块和懒加载功能，使用方法见[webpack文档](https://www.webpackjs.com/guides/code-splitting/#%E5%8A%A8%E6%80%81%E5%AF%BC%E5%85%A5-dynamic-imports-)  


> 模板集成了本地开发服务器和上线压缩混淆功能，用来处理传统多页面开发

## Feature
* 提供css、less、postcss和stylus等loader来解析样式，打包上线会提取单独的css文件。
* 提供babel-loader来转码ES6/7/8等语法，提供babel-plugin-transform-runtime来转码最新的ES语法，支持stage3的提案语法。可选生成source-map供调试，
* 提供url-loader打包图片和字体，在引入iconfont的时候需要手动改iconfont.css的路径为相对路径并且删掉引号
* 提供cdn库模块引入功能，对应webpack的externals选项。
* 开发环境自动开启热更新,可选是否自动打开index.html，并且提供了和vue-cli相同的错误提示命令行提示界面。
* 开发环境提供http-proxy来代理服务器，解决开发时跨域问题
* 开发环境端口会自动解决占用问题，例如8080端口被占用，此时本地服务器会寻找8081或其余自由的端口
* 开发环境ip地址支持设置为本机局域网ip，解决localhost无法被局域网访问的问题(只在连接wifi情况有效)
* 生产环境支持代码切割、缓存和懒加载功能，多页面引入同一库不会重复打包。拆分vendor和manifest公共chunk，添加hash缓存，提高重复打包效率
* 提供多页面多入口打包的功能，智能根据同名的html和js按需插入资源。
* 为避免产品上线由于后端没有把项目放在服务器根目录导致路径的错误问题，本模板默认资源路径全部为相对路径！(publicPath是个神坑...)

## 目录解释和开发建议
``` bash
├─src
│  ├─assets
│  │  └─img
│  ├─component
│  └─page
│      └─index
└─webpack.config
```
* 本模板建议使用者采用组件思想开发，page目录为页面，每个页面单独新建一个同名文件夹，内含该页面的html，js和css，<span style='color:red'>html和js一定要同名！</span>，这样是为了让webpack只给html插入对应同名的js文件，避免重复加载资源，模板会自动查询出所有需要打包的资源。component目录建议编写js和css模块,assets建议放图片和字体等资源
* 如果page内某一文件夹只有js没有html，同样会打包该js。如果只有html，没有js，也会打包html，只是不会插入js文件
* 根目录里<span style='color:red;'>src下的page文件夹不能删除！</span>必须保证page下存在index文件夹，包含index.html和index.js，因为开发模式本地服务器默认会打开index.html
* 根目录里<span style='color:red;'>src下的component文件夹不能删除！</span>因为模板会查询所有第三方模块，来抽离出所有可能的公用模块
* 开发时不要在html里写link和sript标签，模板会自动插入css和js。生产模式会自动生成html并且嵌入link和script标签，打包之后的所有资源都会放在dist文件夹。
* 当需要在js里输入其他页面的html路径时，直接输入绝对路径即可。例如：'test.html',无论是开发环境还是生产环境都会默认指向生成的test.html
* 模板提供了两个符号来替代常用绝对路径，`@ => src目录`，`component => src/component目录`。

## Unique 
1. 智能打包拆分重复模块，只要在页面js里引入从`node_modules`导入的库，就会单独生成一个`vendor.js`。如果超过<span style='color:red;'>两个</span>页面的js引入了同一个js模块(非`node_modules`导入)，就会单独生成一个`common.js`(不会和vendor重复)。如果只有一个页面js引入了其他模块(非`node_modules`导入),则不会抽离出`common.js`。
2. 抽离出`manifest.js`,避免每次重复打包webapck的runtime。
3. html模块自动嵌入对应的js，例如：index.html最终只会嵌入index.js的srcript，而不会有其他页面的js，虽然最终会生成很多个js文件。

## Tips and Problems
1. 目前只能做到webpack热更新，而做不到热替换，必须要对应的loader来支持(vue和react都有对用的loader来解析)。如果想手动实现热替换，必须要在页面js里写 `module.hot.accept()`。
2. webpack的热更新无法做到html更新，我舍弃了raw-loader的做法，很繁琐，不适用，所以目前如果你改动了html还是需要你手动刷新页面。
3. 虽然实现了智能拆分重复模块和动态加载模块，但是并没有完全实现html智能嵌入js。例如：`index.js`引入了`axios`，也引入了开发者自己写的`format.js`模块，`sub.js`两个都没引入，`bar.js`没有引入`axios`,但是引入了`format.js`。理想情况是，
``` bash
// index.html
<script src="vendor.js">
<script src="common.js"> 
<script src="index.js">
<script src="manifest.js">

// sub.html
<script src="sub.js">
<script src="manifest.js">  

// bar.html
<script src="common.js"> 
<script src="bar.js">
<script src="manifest.js">

```
然而现实却是每个页面都会加载打包后的所有js文件：
``` bash
// index.html
<script src="vendor.js">
<script src="common.js"> 
<script src="index.js">
<script src="manifest.js">

// sub.html
<script src="vendor.js">
<script src="common.js"> 
<script src="sub.js">
<script src="manifest.js">

// bar.html
<script src="vendor.js">
<script src="common.js"> 
<script src="bar.js">
<script src="manifest.js">

```
目前这个情况不好解决，因为`html-webpack-plugin`的chunks选项是写死的，但是拆分模块的`CommonsChunkPlugin`却可以动态生成。我准备从`html-webpack-plugin`提供的hook函数入手，只能看后续能否解决了....
> 所有页面最少会嵌入两个js文件，一个是页面本身对应的同名js，一个是manifest.js(必存在)。所有页面最多会嵌入4个js，包含vendor.js(库)，common.js(开发者自行引入的模块)，页面同名js和manifest.js

## Usage
> 强烈建议通过我仓库内的[alan-cli](https://github.com/alanchenchen/alan-cli)来使用，非常便捷！
* 1.git clone https://github.com/alanchenchen/simple-template.git
* 2.npm install 
* 3.npm run dev 或者npm start  --启动开发环境，默认不会自动打开浏览器，更改js或css代码，浏览器会热替换，请注意html模板内的内容改变浏览器不会刷新
* 4.npm run build --启动生产环境，打包page内的js文件，生成以html文件为模板的资源，所有资源都放在dist目录内(打包之后的文件路径全改为相对路径,可以直接打开！！)
* 5.可以在webpack.config文件夹下的config.js里修改配置，提供了大量可修改配置。
* 6.本模板提供externals和公共chunk拆分两种可选功能，但还是建议第三方库引入cdn而不是通过npm包引入，否则会让打包后文件非常大。设置externals只需先在相关页面里引入script，然后在config.js配置，就可以在js里把cdn插件当作模块引入。<span style="color:red;font-weight:bold">修改config里的东西一定要重新打开本地服务器！</span>
* 7.如果想使用css预编译工具，目前模板支持less和stylus等loader，但是，你必须要自己手动npm安装对应的预编译工具，例如`npm install --save-dev stylus`

## Something to say
写这个webpack模板前后历时8个月左右，大改版了很多次，从一开始只支持webpack-dev-server和简单的打包，到现在支持智能拆分模块。其实很多人用这个模板不会去考虑到我做的很多优化，当然，这也是模板存在的意义。webpack是个很好的工具，但是如果不进行详细的配置，你大概只能使用最基本的功能。在我写这个模板的时候，webpack还没发布4.0版本，但是今天webpack4.0早已出来几个月，以后这个模板是否会升级到4.0可能看情况吧。webpack4.0支持了零配置开箱即用，但是似乎也带来很多问题，例如很多插件没有同步更新。后续我可能会在仓库里新建一个分支专门开发webpack4.0的模板。至于这个模板到底做了哪些事情，我还是想让使用者了解一下...
1. 通过nodejs先获取指定page目录下的所有js和html的文件名和绝对路径，然后将js导出到webpack的entry选项。用`html-webpack-plugin`将html生成对应的实例导出到webpack的plugins选项。同时在插件里设置好html模板对应插入的chunks名称。
2. 在dev环境，为了让开发更加友好便捷，使用`portFinder`模块解决端口占用问题，使用`friendly-errors-webpack-plugin`模块来让命令行窗口美化(模仿vue)，使用nodejs获取到当前网络的IPV4地址，让使用者可选是否需要本地服务器被局域网访问。
3. 在pro环境，为了让打包时间缩短，避免重复打包，使用`CommonsChunkPlugin`先抽出页面里的所有公共chunks(包含库和第三方手写模块)，再抽离vendor，最后抽离manifest。一定要注意CommonsChunkPlugin实例的顺序！智能拆分其实就是规定了必须超过2个页面js同时引入了一个模块，才会抽出common.js。
4. 使用externals选项让使用者可以引入cdn插件，在js里可以通过模块语法来使用。
