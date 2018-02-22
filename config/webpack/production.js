// config/webpack/production.js
const environment = require('./environment');

const config = environment.toWebpackConfig();
config.devtool = 'none';

module.exports = config;
