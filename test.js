var BugzillaAPI = require('./BugzillaAPI');
var bz = new BugzillaAPI("ThisFakeEmail@gmail.com", "MyPass1234", 'http://bugzilla.ThisFakeCompany.com/');
bz.printMsg();
