const JasmineReporters = require('jasmine-reporters');
const HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
const conf = require('./conf');

conf.config.onPrepare = function() {
  jasmine.getEnv().addReporter(new JasmineReporters.JUnitXmlReporter({
    savePath: 'reports',
    consolidateAll: false
  }));
  jasmine.getEnv().addReporter(new HtmlScreenshotReporter({
    dest: "reports/screenshots"
  }));
};

exports.config = conf.config;