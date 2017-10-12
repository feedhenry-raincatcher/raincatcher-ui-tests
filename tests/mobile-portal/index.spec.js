const core = require('../../utils/api');
var AuthService = require('../../services/portal/auth.so');
var authService = new AuthService();
var authData = require('../../data/auth.do');
var WorkflowService = require('../../services/portal/workflow.so');
var workflowService = new WorkflowService();
var WorkorderService = require('../../services/portal/workorder.so');
var workorderService = new WorkorderService();
var MobileAuthService = require('../../services/mobile/auth.so');
var mobileAuthService = new MobileAuthService();
var MobileWorkorderService = require('../../services/mobile/workorder.so');
var mobileWorkorderService = new MobileWorkorderService();
var MobileWorkflowService = require('../../services/mobile/workflow.so');
var mobileWorkflowService = new MobileWorkflowService();

const prefix = 'test-';
const workflow = { title: prefix + 'workflow' };
const workorder = {
  title: prefix + 'workorder',
  assignee: authData.users.TREVER.fullName,
  workflow: workflow.title + ' v5',
  summary: 'test',
  status: 'New'
};
const steps = [
  { name: 'vehicle1', type: 'Vehicle Inspection Step', tires: 'Fail', lights: 'Pass' },
  { name: 'accident', type: 'Accident Report Form', number: 'testA', owner: 'testB', phone: 'testC' },
  { name: 'signature', type: 'Signature step' },
  { name: 'vehicle2', type: 'Vehicle Inspection Step', tires: 'Pass', lights: 'Fail' }
];

describe('MOBILE-PORTAL E2E', function() {
  beforeAll(function() {
    browser.ignoreSynchronization = true;
    authService.openPortalApp();
    authService.loginToPortalApp(authData.users.DAISY.username, authData.password.DEFAULT_PASSWORD);
    authService.verifySuccessfulLogin();

    return core.auth.login(authData.users.DAISY.username, authData.password.DEFAULT_PASSWORD)
      .then(() => core.cleanup(prefix));
  });

  it('should pass the test', function() {
    // Create workflow
    browser.refresh();
    browser.ignoreSynchronization = false;
    workflowService.create(workflow);

    // Add steps
    steps.forEach(step =>
      workflowService.addStep(workflow, step)
    );

    // Verify step panel is visible, name is correct and step definition is correct
    steps.forEach((step, index) =>
      workflowService.expectStepToBe(index + 1, step)
    );

    // Verify add new step panel is visible below created step, with no values
    workflowService.expectAddStepPresent();

    workorderService.create(workorder);
    workorderService.expectDetailsToBe(workorder);

    mobileAuthService.openMobileApp();
    browser.driver.executeScript(function() {
      sessionStorage.clear();
      localStorage.clear();
    });
    mobileAuthService.openMobileApp();
    mobileAuthService.verifyLoginPageIsVisible();
    mobileAuthService.loginToMobileApp(authData.users.TREVER.username,
      authData.password.DEFAULT_PASSWORD);
    mobileAuthService.verifySuccessfulLogin();

    browser.sleep(20000);
    mobileWorkorderService.selectWorkorderFromTheList(workorder.title);

    mobileWorkorderService.beginWorkflow();

    mobileWorkflowService.setWorkflowDetails(50, 'fail', 'pass');
    browser.sleep(5000);
    mobileWorkflowService.submitWorkflowDetails();

    element(by.css('input[ng-model="ctrl.model.regNr"]')).sendKeys(steps[1].number);
    element(by.css('input[ng-model="ctrl.model.owner"]')).sendKeys(steps[1].owner);
    element(by.css('input[ng-model="ctrl.model.phone"]')).sendKeys(steps[1].phone);
    browser.sleep(5000);
    mobileWorkflowService.submitWorkflowDetails();

    element(by.css('.signature-form canvas')).click();
    browser.sleep(5000);
    mobileWorkflowService.submitWorkflowDetails();

    mobileWorkflowService.goBack();
    browser.sleep(5000);
    mobileWorkflowService.submitWorkflowDetails();

    mobileWorkflowService.setWorkflowDetails(50, 'pass', 'fail');
    browser.sleep(5000);
    mobileWorkflowService.submitWorkflowDetails();
    browser.sleep(60000);

    steps.forEach((step, index) =>
      mobileWorkflowService.checkCompletedWorkflowStep(index, step)
    );

    element(by.css('md-sidenav md-list-item:nth-of-type(1) button')).click();
    mobileWorkorderService.selectWorkorderFromTheList(workorder.title);

    steps.forEach((step, index) =>
      mobileWorkflowService.checkCompletedWorkflowStep(index, step)
    );

    mobileWorkorderService.verifyWorkorderWorkflowIsCompleted();

    authService.openPortalApp();
    workorderService.open(workorder);
    browser.sleep(10000);

    workorderService.expectSteps(steps);
  });
});