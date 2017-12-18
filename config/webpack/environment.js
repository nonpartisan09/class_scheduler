const { environment } = require('@rails/webpacker');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const { dev_server: devServer } = require('@rails/webpacker/package/config');

const postcssConfigPath = path.resolve(process.cwd(), '.postcssrc.yml');
const isProduction = process.env.NODE_ENV === 'production';
const extractCSS = !(devServer && devServer.hmr);

const extractOptions = {
  fallback: 'style-loader',
  use: [
    { loader: 'css-loader', options: { minimize: isProduction } },
    { loader: 'postcss-loader', options: { sourceMap: true, config: { path: postcssConfigPath } } },
    'resolve-url-loader',
    { loader: 'less-loader', options: { sourceMap: true } }
  ]
};

// For production extract styles to a separate bundle
const extractCSSLoader = {
  test: /\.less$/i,
  use: ExtractTextPlugin.extract(extractOptions)
};

// For hot-reloading use regular loaders
const inlineCSSLoader = {
  test: /\.less$/i,
  use: ['style-loader'].concat(extractOptions.use)
};

const lessLoader = isProduction || extractCSS ? extractCSSLoader : inlineCSSLoader;

environment.loaders.set('less', lessLoader);

module.exports = environment;
