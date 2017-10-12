var authData = require('../../data/auth.do');
var AuthService = require('../../services/mobile/auth.so');
var authService = new AuthService();
var WorkorderService = require('../../services/mobile/workorder.so');
var workorderService = new WorkorderService();
var WorkflowService = require('../../services/mobile/workflow.so');
var workflowService = new WorkflowService();
var core = require('../../utils/api');

const prefix = 'test-';
const workflowTitle = prefix + 'workflow';
const workorderTitle = prefix + 'workorder';
const vehicleStepTitle = prefix + 'vehicle';

describe('MOBILE E2E', function() {

  let workorder;
  let workflow;

  beforeAll(function() {
    return core.auth.login(authData.users.DAISY.username, authData.password.DEFAULT_PASSWORD)
      .then(() => core.cleanup(prefix))
      .then(() => core.workflows.create(workflowTitle))
      .then(wf => {
        workflow = wf;
        return core.workflows.addStep(vehicleStepTitle, 'vehicleInspection', wf.id);
      })
      .then(() => core.users.filter(authData.users.TREVER.username))
      .then(u => core.workorders.create(workorderTitle, u.users[0].id, workflow.id))
      .then(wo => workorder = wo);
  });

  it('should complete workorder', function() {
    authService.openMobileApp();
    browser.driver.executeScript(function() {
      sessionStorage.clear();
      localStorage.clear();
    });
    authService.openMobileApp();
    authService.verifyLoginPageIsVisible();
    authService.loginToMobileApp(authData.users.TREVER.username,
      authData.password.DEFAULT_PASSWORD);
    authService.verifySuccessfulLogin();
    browser.sleep(20000);
    workorderService.selectWorkorderFromTheList(workorderTitle);
    browser.sleep(1000);
    const workorderDetails = {
      id: workorder.id,
      status: 'New',
      workorderName: workorderTitle
    };
    workorderService.verifyWorkorderDetailsArePresentAndCorrect(workorderDetails);
    workorderService.verifyWorkorderWorkflowIsNotCompleted();
    workorderService.beginWorkflow();
    workflowService.verifyWorkflowFormIsVisible();
    workflowService.cancelWorkflowChanges();
    browser.sleep(1000);
    workorderService.verifyWorkorderWorkflowIsNotCompleted();
    workorderService.beginWorkflow();
    browser.sleep(10000);
    workflowService.submitWorkflowDetails();
    browser.sleep(1000);
    workorderService.verifyWorkorderWorkflowIsCompleted();
    authService.logoutOfMobileApp();
  });
});
