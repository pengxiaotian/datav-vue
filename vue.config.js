// eslint-disable-next-line @typescript-eslint/no-var-requires
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
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
  },
}
