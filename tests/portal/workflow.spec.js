var WorkflowService = require('../../services/portal/workflow.so');
var workflowService = new WorkflowService();

var data = require('../../data/workflows.do');

var authData = require('../../data/auth.do');
var AuthService = require('../../services/portal/auth.so');
var authService = new AuthService();

var core = require('../../utils/api');

const prefix = 'test-';
data.workflows.CREATE.title = prefix + data.workflows.CREATE.title;
data.workflows.UPDATE1.title = prefix + data.workflows.UPDATE1.title;
data.workflows.UPDATE2.title = prefix + data.workflows.UPDATE2.title;
data.workflows.CANCEL.title = prefix + data.workflows.CANCEL.title;
data.workflows.SEARCH.title = prefix + data.workflows.SEARCH.title;
data.workflows.DELETE.title = prefix + data.workflows.DELETE.title;

describe('PORTAL Workflow E2E', function() {

  beforeAll(function() {
    browser.ignoreSynchronization = true;
    authService.openPortalApp();
    authService.loginToPortalApp(authData.users.DAISY.username,
      authData.password.DEFAULT_PASSWORD);
    authService.verifySuccessfulLogin();
    return core.auth.login(authData.users.DAISY.username, authData.password.DEFAULT_PASSWORD)
      .then(() => core.cleanup(prefix));
  });

  afterAll(function() {
    authService.logoutOfPortalApp();
  });

  describe('CREATE', function() {
    it('should not create empty workflow', function() {
      browser.ignoreSynchronization = false;
      workflowService.create({}, true);
      workflowService.expectWarningsPresent();
    });
    it('should create workflow', function() {
      workflowService.create(data.workflows.CREATE);
      browser.refresh(); // workaround for https://issues.jboss.org/browse/RAINCATCH-1225
      workflowService.open(data.workflows.CREATE);
      workflowService.expectDetailsToBe(data.workflows.CREATE);
      workflowService.expectToBeInList(data.workflows.CREATE);
    });
    afterAll(function() {
      return core.workflows.removeByName(data.workflows.CREATE.title);
    });
  });

  describe('UPDATE', function() {
    beforeAll(function() {
      return core.workflows.create(data.workflows.UPDATE1.title);
    });
    it('should update workflow', function() {
      browser.refresh(); // workaround for https://issues.jboss.org/browse/RAINCATCH-1225
      workflowService.update(data.workflows.UPDATE1, data.workflows.UPDATE2);
      workflowService.expectDetailsToBe(data.workflows.UPDATE2);
      browser.refresh(); // workaround for https://issues.jboss.org/browse/RAINCATCH-1225
      workflowService.expectToBeInList(data.workflows.UPDATE2);
      workflowService.expectNotInTheList(data.workflows.UPDATE1);
    });
    afterAll(function() {
      return core.workflows.removeByName(data.workflows.UPDATE2.title);
    });
  });

  describe('CANCEL', function() {
    beforeAll(function() {
      return core.workflows.create(data.workflows.CANCEL.title);
    });
    it('should cancel deletion', function() {
      browser.refresh(); // workaround for https://issues.jboss.org/browse/RAINCATCH-1225
      workflowService.open(data.workflows.CANCEL);
      workflowService.pressDeleteButton();
      workflowService.pressCancelButton();
      workflowService.expectToBeInList(data.workflows.CANCEL);
    });
    it('should cancel creation', function() {
      workflowService.pressNewButton();
      workflowService.pressNewCancelButton();
      workflowService.expectNewButtonIsPresent();
    });
    it('should cancel update', function() {
      workflowService.open(data.workflows.CANCEL);
      workflowService.pressEditButton();
      workflowService.pressNewCancelButton();
      workflowService.expectDetailsToBe(data.workflows.CANCEL);
    });
    afterAll(function() {
      return core.workflows.removeByName(data.workflows.CANCEL.title);
    });
  });

  describe('SEARCH', function() {
    var searched;
    beforeAll(function() {
      return core.workflows.create(data.workflows.SEARCH.title);
    });
    it('should search workflow', function() {
      browser.refresh(); // workaround for https://issues.jboss.org/browse/RAINCATCH-1225
      searched = workflowService.search(data.workflows.SEARCH, 1);
      workflowService.expectElementDetailsEqualTo(searched, data.workflows.SEARCH);
      workflowService.expectElementDetailsNotEqualTo(searched, data.workflows.DELETE);
      workflowService.searchReset();
    });
    afterAll(function() {
      return core.workflows.removeByName(data.workflows.SEARCH.title);
    });
  });

  describe('DELETE', function() {
    beforeAll(function() {
      return core.workflows.create(data.workflows.DELETE.title);
    });
    it('should remove workflow', function() {
      browser.refresh(); // workaround for https://issues.jboss.org/browse/RAINCATCH-1225
      workflowService.remove(data.workflows.DELETE);
      browser.refresh(); // workaround for https://issues.jboss.org/browse/RAINCATCH-1225
      workflowService.expectNotInTheList(data.workflows.DELETE);
    });
  });
});
