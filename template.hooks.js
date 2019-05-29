module.exports = {
    afterInit({print}) {
        print.warn(
            `
            npm install or yarn 安装依赖
            npm start启动开发环境
            npm run build打包代码
            `
        )
    }
}