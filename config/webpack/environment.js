const { environment } = require('@rails/webpacker');
const ExtractTextPlugin  = require('extract-text-webpack-plugin');
const { env } = require('process');

environment.loaders.set('less', {
  test: /\.less$/i,
  use: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      { loader: 'css-loader', options: { minimize: env.NODE_ENV === 'production' } },
      { loader: 'postcss-loader', options: { sourceMap: true } },
      { loader: 'less-loader', options: { sourceMap: true } }
    ]
  })
});

module.exports = environment;
