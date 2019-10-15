/**
* created by vue-mobile-preset
* @author DaveJump <davejump16@gmail.com>
*/

const glob = require('glob')
const path = require('path')
const webpack = require('webpack')
const eslintFriendlyFormatter = require('eslint-friendly-formatter')
const TerserPlugin = require('terser-webpack-plugin')
const resolve = dir => path.resolve(__dirname, dir)
const VUE_APP_ALLOW_ENTRY = process.env.VUE_APP_ALLOW_ENTRY || ''
const PAGE_PATH = resolve('src/pages')
const pkg = require('./package')
const isProd = process.env.NODE_ENV === 'production'

/**
 * Multi-Pages Config
 */
function getPagesConfig (entry) {
  let pages = {}
  // define entry files like: index.html, main.js, root.vue
  glob.sync(PAGE_PATH + '/*/main.js')
    .forEach(filePath => {
      let pageName = path.basename(path.dirname(filePath))

      if (entry && entry !== pageName) return

      pages[pageName] = {
        entry: filePath,
        filename: `${pageName === 'main' ? '' : pageName + '/'}index.html`,
        template: './public/index.html',
        chunks: ['lib', 'vendors', 'manifest', pageName],
        ...pkg.appConfig
      }
    })
  return pages
}

const pages = getPagesConfig(VUE_APP_ALLOW_ENTRY)

module.exports = {
  publicPath: isProd ? (process.env.PUBLIC_PATH ? process.env.PUBLIC_PATH : pkg.appConfig.publicPath) : '/',
  assetsDir: '',
  // filenameHashing: false,
  productionSourceMap: false,
  lintOnSave: true,
  // Multi pages
  pages: {
    ...pages
  },
  // Webpack config
  configureWebpack: {
    cache: true,
    performance: {
      hints: false
    },
    optimization: {
      runtimeChunk: isProd ? { name: 'manifest' } : false,
      splitChunks: {
        automaticNameDelimiter: '--',
        cacheGroups: {
          vendors: {
            name: 'vendors',
            chunks: 'initial',
            test: /[\\/]node_modules[\\/]/,
            priority: 2
          },
          vue: {
            name: 'lib',
            test: (module) => {
              return /vue|axios|vant/g.test(module.context)
            },
            chunks: 'initial',
            priority: 10
          }
        }
      },
      minimizer: [
        // Remove console from build file
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: isProd
            }
          }
        })
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        // PUBLIC_PATH: '/',
        APP_NAME: JSON.stringify(pkg.name)
      })
    ]
  },
  // ChainWebpack settings
  chainWebpack: config => {
    // Alias
    config.resolve
      .alias
      .set('vue$', resolve('./node_modules/vue/dist/vue.common.js'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('lib', resolve('src/lib'))
      .set('api', resolve('src/lib/api'))
      .set('utils', resolve('src/lib/utils'))
      .set('mixins', resolve('src/mixins'))

    // Set alias depend on multi-pages
    Object.keys(pages)
      .forEach(pageName => {
        config.resolve.alias.set(pageName, resolve(`src/pages/${pageName}`))
      })

    /* Eslint loader and formatter */
    config.module
      .rule('eslint')
      .use('eslint-loader')
      .loader('eslint-loader')
      .options({
        formatter: eslintFriendlyFormatter,
        fix: true
      })
  },
  // Server of development
  devServer: {
    port: process.env.PORT || 5000
    // proxy: {}
  },
  // Import var to global
  css: {
    loaderOptions: {
      '<%= options.cssPreprocessor === "scss" ? "sass" : "less"%>': {
        data: `
          @import "~@/assets/<%= options.cssPreprocessor%>/vars.<%= options.cssPreprocessor%>";
          @import "~@/assets/<%= options.cssPreprocessor%>/mixins.<%= options.cssPreprocessor%>";
        `
      }
    }
  }
  <%_ if (options.PWASupport) { _%>
  ,
  // PWA config，see detail: https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-plugin-pwa/README.md
  pwa: {
    workboxOptions: {
      skipWaiting: true
    }
  },
  <%_ } _%>
}
