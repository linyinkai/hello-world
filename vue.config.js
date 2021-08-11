// const isProd = process.env.NODE_ENV === 'production'
const path = require('path')

const resolveRealPath = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  productionSourceMap: false,
  publicPath: './',
  devServer: {
    proxy: 'https://law-dev.yun-chang.com'
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      },
      sass: {
        prependData:
          '@import ' +
          '"@/assets/styles/_variables.scss",' +
          '"@/assets/styles/_functions.scss",' +
          '"@/assets/styles/_mixins.scss"' +
          ';'
      }
    }
  },

  chainWebpack: config => {
    config.resolve.alias
      .set('@styles', resolveRealPath('src/assets/styles'))
      .set('@images', resolveRealPath('src/assets/images'))
      .set('@utils', resolveRealPath('src/utils'))
      .set(
        '@screen-components',
        resolveRealPath('src/views/data-screen/components')
      )

    // svg loader
    const svgRule = config.module.rule('svg') // 找到svg-loader
    svgRule.uses.clear() // 清除已有的loader, 如果不这样做会添加在此loader之后
    svgRule.exclude.add(/node_modules/) // 正则匹配排除node_modules目录
    svgRule // 添加svg新的loader处理
      .test(/\.svg$/)
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })

    // 修改images loader 添加svg处理
    const imagesRule = config.module.rule('images')
    imagesRule.exclude.add(resolveRealPath('src/icons'))
    config.module.rule('images').test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
  }
}
