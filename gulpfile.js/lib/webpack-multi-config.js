var config = require('../config')
if(!config.tasks.js) return

var path            = require('path')
var pathToUrl       = require('./pathToUrl')
var webpack         = require('webpack')
var webpackManifest = require('./webpackManifest')

module.exports = function(env) {
  var jsSrc = path.resolve(config.root.src, config.tasks.js.src)
  var jsDest = path.resolve(config.root.dest, config.tasks.js.dest)
  var publicPath = pathToUrl(config.tasks.js.dest, '/')

  var extensions = config.tasks.js.extensions.map(function(extension) {
    return '.' + extension
  })

  var rev = config.tasks.production.rev && env === 'production'
  var filenamePattern = rev ? '[name]-[hash].js' : '[name].js'

  var webpackConfig = {
    context: jsSrc,
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        FastClick: 'FastClick',
        gsap: 'gsap',
        _: 'lodash',
        Hammer: 'hammer',
        'SVG4EveryBody': 'svgsvg4everybody'
        })
    ],
    
    resolve: {
      modules: [
        jsSrc,
        'node_modules',
        'modules',
        'components',
        'utils'
      ],
      alias: {
        'hammer': path.resolve('node_modules', 'hammerjs/hammer.js'),
        'TweenLite': path.resolve('node_modules', 'gsap/src/uncompressed/TweenLite.js'),
        'TweenMax': path.resolve('node_modules', 'gsap/src/uncompressed/TweenMax.js'),
        'TimelineLite': path.resolve('node_modules', 'gsap/src/uncompressed/TimelineLite.js'),
        "TimelineMax": path.resolve('node_modules', 'gsap/src/uncompressed/TimelineMax.js')
      },
      enforceExtension: false
    },

    module: {
      rules: [{
        test: /\.js$/,
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-1']
          }
        },
      }, {
        test: /\.json$/,
        exclude: [/node_modules/],
        use: {
          loader: 'json-loader'
        },
      }]
    }
  }

  if(env === 'development') {
    webpackConfig.devtool = 'inline-source-map'

    // Create new entries object with webpack-hot-middleware added
    for (var key in config.tasks.js.entries) {
      var entry = config.tasks.js.entries[key]
      config.tasks.js.entries[key] = ['webpack-hot-middleware/client?&reload=true'].concat(entry)
    }

    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
  }

  if(env !== 'test') {
    // Karma doesn't need entry points or output settings
    webpackConfig.entry = config.tasks.js.entries

    webpackConfig.output= {
      path: path.normalize(jsDest),
      filename: filenamePattern,
      publicPath: publicPath
    }

    if(config.tasks.js.extractSharedJs) {
      // Factor out common dependencies into a shared.js
      webpackConfig.plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
          name: 'shared',
          filename: filenamePattern,
        })
      )
    }
  }

  if(env === 'production') {
    if(rev) {
      webpackConfig.plugins.push(new webpackManifest(publicPath, config.root.dest))
    }
    webpackConfig.plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    )
  }

  return webpackConfig
}
