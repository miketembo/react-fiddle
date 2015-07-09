var path = require('path');
var util = require('util');
var autoprefixer = require('autoprefixer-core');
var pkg = require('../package.json');

var loaders = require('./loaders');
var plugins = require('./plugins');

var DEBUG = process.env.NODE_ENV === 'development';
var TEST = process.env.NODE_ENV === 'test';

var jsBundle = path.join('js', util.format('[name].%s.js', pkg.version));

var entry = {
  app: ['./app.jsx']
};

if (DEBUG) {
  // entry.app.unshift(
  //   '../webpack/dev-support.js'
  // );

  entry.app.unshift(
    util.format(
      'webpack-dev-server/client?http://%s:%d',
      pkg.config.devHost,
      pkg.config.devPort
    )
  );
  // entry.app.push('webpack/hot/dev-server');
}

var config = {
  context: path.join(__dirname, '../app'),
  cache: DEBUG,
  debug: DEBUG,
  target: 'web',
  devtool: DEBUG || TEST ? 'eval' : false,
  entry: entry,
  output: {
    path: path.resolve(pkg.config.buildDir),
    publicPath: '/',
    filename: jsBundle,
    pathinfo: false
  },
  module: {
    loaders: loaders
  },
  postcss: [
    autoprefixer
  ],
  plugins: plugins,
  resolve: {
    root: [
      path.join(__dirname, '../app')
    ],
    extensions: ['', '.js', '.json', '.jsx']
  },
  devServer: {
    contentBase: path.resolve(pkg.config.buildDir),
    hot: false,
    noInfo: false,
    quiet: false,
    inline: true,
    stats: { colors: true }
  }
};

module.exports = config;
