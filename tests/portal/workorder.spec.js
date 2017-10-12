var WorkorderService = require('../../services/portal/workorder.so');
var workorderService = new WorkorderService();

var data = require('../../data/workorders.do');

var authData = require('../../data/auth.do');
var AuthService = require('../../services/portal/auth.so');
var authService = new AuthService();

var core = require('../../utils/api');

const prefix = 'test-';
data.workflows.WORKFLOW1.title = prefix + data.workflows.WORKFLOW1.title;
data.workflows.WORKFLOW2.title = prefix + data.workflows.WORKFLOW2.title;
data.workorders.CREATE.title = prefix + data.workorders.CREATE.title;
data.workorders.CREATE.workflow = prefix + data.workorders.CREATE.workflow;
data.workorders.UPDATE1.title = prefix + data.workorders.UPDATE1.title;
data.workorders.UPDATE2.title = prefix + data.workorders.UPDATE2.title;
data.workorders.UPDATE2.workflow = prefix + data.workorders.UPDATE2.workflow;
data.workorders.CANCEL.title = prefix + data.workorders.CANCEL.title;
data.workorders.CANCEL.workflow = prefix + data.workorders.CANCEL.workflow;
data.workorders.SEARCH.title = prefix + data.workorders.SEARCH.title;
data.workorders.DELETE.title = prefix + data.workorders.DELETE.title;

describe('PORTAL Workorder E2E', function() {
  beforeAll(function() {
    browser.ignoreSynchronization = true;
    authService.openPortalApp();
    authService.loginToPortalApp(authData.users.DAISY.username,
      authData.password.DEFAULT_PASSWORD);
    authService.verifySuccessfulLogin();
    return core.auth.login(authData.users.DAISY.username, authData.password.DEFAULT_PASSWORD)
      .then(() => core.workflows.create(data.workflows.WORKFLOW1.title))
      .then(() => core.workflows.create(data.workflows.WORKFLOW2.title));
  });

  afterAll(function() {
    authService.logoutOfPortalApp();
    return core.workflows.removeByName(data.workflows.WORKFLOW1.title)
      .then(() => core.workflows.removeByName(data.workflows.WORKFLOW2.title));
  });

  describe('CREATE', function() {
    it('should not create an empty{} workorder', function() {
      browser.ignoreSynchronization = false;
      workorderService.create({}, true);
      workorderService.expectWarningsPresent();
    });
    it('should create a workorder', function() {
      workorderService.create(workorderService.clone(data.workorders.CREATE, data.workflows.WORKFLOW1.title));
      workorderService.open(data.workorders.CREATE); // open workorder to see details
      workorderService.expectDetailsToBe(data.workorders.CREATE); // compare workorder details
      workorderService.expectToBeInList(data.workorders.CREATE);
    });
    afterAll(function() {
      return core.workorders.removeByName(data.workorders.CREATE.title);
    });
  });

  describe('UPDATE', function() {
    beforeAll(function() {
      const wo = workorderService.clone(data.workorders.UPDATE1, data.workflows.WORKFLOW1.title);
      return core.workorders.createByName(wo.title, undefined, wo.workflow);
    });
    it('should update workorder', function() {
      browser.refresh();
      workorderService.update(data.workorders.UPDATE1, workorderService.clone(data.workorders.UPDATE2, data.workflows.WORKFLOW2.title));
      workorderService.open(data.workorders.UPDATE2); // open workorder to see details
      workorderService.expectDetailsToBe(data.workorders.UPDATE2); // verify workorder details
      workorderService.expectToBeInList(data.workorders.UPDATE2);
      workorderService.expectNotInTheList(data.workorders.UPDATE1);
    });
    afterAll(function() {
      return core.workorders.removeByName(data.workorders.UPDATE2.title);
    });
  });

  describe('CANCEL', function() {
    beforeAll(function() {
      const wo = workorderService.clone(data.workorders.CANCEL, data.workflows.WORKFLOW1.title);
      return core.workorders.createByName(wo.title, authData.users.TREVER.username, wo.workflow);
    });
    it('should cancel deletion', function() {
      browser.refresh();
      workorderService.open(data.workorders.CANCEL);
      workorderService.pressDeleteButton();
      workorderService.pressCancelButton();
      workorderService.expectToBeInList(data.workorders.CANCEL);
    });
    it('should cancel creation', function() {
      workorderService.pressNewButton();
      workorderService.pressNewCancelButton();
      workorderService.expectNewButtonIsPresent();
    });
    it('should cancel update', function() {
      workorderService.open(data.workorders.CANCEL);
      workorderService.pressEditButton();
      workorderService.pressNewCancelButton();
      workorderService.expectDetailsToBe(data.workorders.CANCEL);
    });
    afterAll(function() {
      return core.workorders.removeByName(data.workorders.CANCEL.title);
    });
  });

  describe('SEARCH', function() {
    var searched;
    beforeAll(function() {
      const wo = workorderService.clone(data.workorders.SEARCH, data.workflows.WORKFLOW1.title);
      return core.workorders.createByName(wo.title, authData.users.TREVER.username, wo.workflow);
    });
    it('should search workorder', function() {
      browser.refresh();
      searched = workorderService.search(data.workorders.SEARCH, 1);
      workorderService.expectElementDetailsEqualTo(searched, data.workorders.SEARCH);
      workorderService.expectElementDetailsNotEqualTo(searched, data.workorders.DELETE);
      workorderService.searchReset();
    });
    afterAll(function() {
      return core.workorders.removeByName(data.workorders.SEARCH.title);
    });
  });

  describe('DELETE', function() {
    beforeAll(function() {
      const wo = workorderService.clone(data.workorders.DELETE, data.workflows.WORKFLOW1.title);
      return core.workorders.createByName(wo.title, authData.users.TREVER.username, wo.workflow);
    });
    it('should remove workorder', function() {
      browser.refresh();
      workorderService.remove(data.workorders.DELETE);
      workorderService.expectNotInTheList(data.workorders.DELETE);
    });
  });
});
