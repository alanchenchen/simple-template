// index.html需要插入的script,所有html需要插入的script都必须与html同名，如果想让页面引入css，必须通过模块导入
// 如果想实现热替换(不刷新整个页面，局部更新)，在下方加上 module.hot.accept()即可

if(module.hot) {
    module.hot.accept()
}