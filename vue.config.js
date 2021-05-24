// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const isDev = process.env.NODE_ENV === 'development'

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
      new webpack.DefinePlugin({
        // Suppress vue-i18-next warning
        __VUE_I18N_LEGACY_API__: false,
        __VUE_I18N_FULL_INSTALL__: false,
        __INTLIFY_PROD_DEVTOOLS__: false,
      }),
      new MonacoWebpackPlugin({
        languages: ['plaintext', 'html', 'javascript', 'json', 'sql'],
        filename: '[name].worker.[contenthash].js',
      }),
    ],
  },
  chainWebpack: config => {
    // https://webpack.js.org/configuration/devtool/#development
    config.when(isDev, config => config.devtool('eval-cheap-source-map'))

    // 解决vue-i18n警告You are running the esm-bundler build of vue-i18n...
    config.resolve.alias
      .set('vue-i18n', resolve('./node_modules/vue-i18n/dist/vue-i18n.cjs.prod.js'))

    config.when(isDev, config =>
      config.module
        .rule('handlebars')
        .test(/\.hbs$/)
        .use('handlebars-loader')
        .loader('handlebars-loader')
        .options({
          partialDirs: [resolve('./handlebars/partials')],
          helperDirs: [resolve('./handlebars/helpers')],
        })
        .end())
  },
}
