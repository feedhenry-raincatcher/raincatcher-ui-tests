var pageConstants = require('../../../data/page_constants');

var LoginPage = function() {
  var locators = {
    buttons: {
      submitButton: element(by.css('button[type="submit"]'))
    },
    fields: {
      usernameField: element(by.id('username')),
      passwordField: element(by.id('password'))
    },
    pageText: {
      usernameLabel: element(by.css('label[for="username"]')),
      passwordLabel: element(by.css('label[for="password"]'))
    },
    warnings: {
      invalidCredentialsErrorMsg: element(by.css('[ng-message="error"]'))
    }
  };

  var commands = {
    openMobileApp: function() {
      return browser.get(pageConstants.login.URL.MOBILE);
    },
    clickSubmitbutton: function() {
      locators.buttons.submitButton.click();
    },
    enterUsername: function(username) {
      locators.fields.usernameField.clear().sendKeys(username);
    },
    enterPassword: function(password) {
      locators.fields.passwordField.clear().sendKeys(password);
    }
  };

  return {
    locators,
    commands
  };
};

module.exports = LoginPage();