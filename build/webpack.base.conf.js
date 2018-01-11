'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  node: {
    fs: 'empty'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      // FIX: pffsu is not browserifiable
      'postcss-font-family-system-ui$': resolve('build/pffsu-monkeypatch.js'),
    }
  },
  module: {
    exprContextRegExp: /$^/,
    exprContextCritical: false,
    rules: [
      ...(config.dev.useEslint? [{
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: !config.dev.showEslintErrorsInOverlay
        }
      }] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')],
      },
      {
        // FIX: Some modules must be transpiled
        test: /\.m?js$/,
        loader: 'babel-loader',
        include: [
          /ansi-styles/,
          /chalk/,
          /postcss-.*selector/,
          /postcss-apply/,
          /postcss-color-rebeccapurple/,
          /postcss-cssnext/,
          /postcss-custom-properties/,
          /postcss-font-family-system-ui/,
          /postcss-nesting/,
          /postcss-replace-overflow-wrap/,
          /postcss-pseudo/,
          /rgb-hex/,
          /vue-color/,
        ],
        options: {
          // FIX: Babel can't resolve nested presets properly
          presets: [
            require.resolve('babel-preset-env'),
            require.resolve('babel-preset-react'),
          ]
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        exclude: /inline\//,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(svg)(\?.*)?$/,
        include: /inline\//,
        loader: 'svg-inline-loader'
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        // FIX: Remove sourcemaps from css parse bugged in browser
        test: /source-map/,
        exclude: /clean-css/,
        loader: 'null-loader'
      }
    ]
  },
  plugins: [
    new webpack.IgnorePlugin(/caniuse-lite\/data\/regions/),
  ]
}
