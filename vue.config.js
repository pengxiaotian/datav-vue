// eslint-disable-next-line @typescript-eslint/no-var-requires
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: '/',
  devServer: {
    host: '0.0.0.0',
    port: 9090,
  },
  pages: {
    index: {
      entry: './src/main.ts',
      title: 'DataV',
    },
  },
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['plaintext', 'javascript', 'json', 'sql'],
        filename: '[name].worker.[contenthash].js',
      }),
    ],
  },
  chainWebpack: config => {
    // https://webpack.js.org/configuration/devtool/#development
    config
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('eval-cheap-source-map'))

    // 解决vue-i18n警告You are running the esm-bundler build of vue-i18n...
    config.resolve.alias
      .set('vue-i18n', resolve('./node_modules/vue-i18n/dist/vue-i18n.cjs.prod.js'))

    config.module
      .rule('handlebars')
      .test(/\.hbs$/)
      .use('handlebars-loader')
      .loader('handlebars-loader')
      .end()
  },
}
