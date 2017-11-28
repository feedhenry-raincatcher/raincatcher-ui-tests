const HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  suites: {
    mobile: 'tests/mobile/*.js',
    portal: 'tests/portal/*.js',
    mobile_portal: 'tests/mobile-portal/*.js'
  },
  jasmineNodeOpts: {
    defaultTimeoutInterval: 300000,
  },
  capabilities: {
    browserName: 'chrome',
    'chromeOptions': {
      prefs: {
        'credentials_enable_service': false,
        'profile': {
          'password_manager_enabled': false
        }
      },
      args: [
        'no-sandbox',
        'user-data-dir=/tmp/chrome',
        'no-default-browser-check',
        'unlimited-storage',
        'disable-cache',
        'disable-application-cache',
        'disable-offline-load-stale-cache',
        'disk-cache-size=0',
        'v8-cache-options=off',
        '--window-size=1280,1024'
      ]
    },
    defaultPageLoadTimeout: 10000,
    defaultImplicitWait: 2000
  },
  onPrepare: function() {
    jasmine.getEnv().addReporter(new HtmlScreenshotReporter({
      dest: "reports/screenshots"
    }));
    jasmine.getEnv().addReporter(new SpecReporter({
      displayStackTrace: 'all'
    }));
  }
};
