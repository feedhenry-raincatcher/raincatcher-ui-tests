const conf = require('./conf');

conf.config.capabilities.chromeOptions.args.push('--headless');

exports.config = conf.config;