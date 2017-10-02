var pageObject = require('../../page-objects/mobile/workorder');
var mainWorkorderPage = pageObject.main;
var selectedWorkorderPage = pageObject.selected;
var utils = require('../../utils');

/**
 *
 * @constructor
 */
function WorkorderService() {

}

WorkorderService.prototype.verifyNumberOfWorkordersInList = function(expectedNumber) {
  utils.check.listSize(mainWorkorderPage.locators.workordersListItems, expectedNumber);
};

WorkorderService.prototype.selectWorkorderFromTheList = function(title) {
  mainWorkorderPage.commands.select(title);
};

WorkorderService.prototype.searchForWorkorderInList = function(workorderName) {
  utils.check.elementsArePresent([ mainWorkorderPage.locators.searchBox ]);
  mainWorkorderPage.commands.searchForWorkorderInList(workorderName);
};

WorkorderService.prototype.verifyWorkorderDetailsArePresentAndCorrect = function(params) {
  utils.check.elementsArePresent([
    selectedWorkorderPage.locators.detailsListItems
  ]);
  expect(selectedWorkorderPage.commands.get.id()).toEqual(params.id);
  expect(selectedWorkorderPage.commands.get.status()).toEqual(params.status);
  expect(selectedWorkorderPage.commands.get.workorderName()).toEqual(params.workorderName);
};

WorkorderService.prototype.verifyWorkorderWorkflowIsNotCompleted = function() {
  utils.check.elementsArePresent([ selectedWorkorderPage.locators.beginWorkflowButton ]);
};

WorkorderService.prototype.verifyWorkorderWorkflowIsCompleted = function() {
  expect(selectedWorkorderPage.commands.get.status()).toEqual('Complete');
};

WorkorderService.prototype.beginWorkflow = function() {
  selectedWorkorderPage.commands.beginWorkflow();
};

WorkorderService.prototype.verifyCompletedWorkflowDetailsArePresent = function(params) {
  utils.check.elementsArePresent([ selectedWorkorderPage.locators ]);
};

module.exports = WorkorderService;