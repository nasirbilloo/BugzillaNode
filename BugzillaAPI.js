var xmlrpc = require('xmlrpc');

//Use it like this:
//var BugzillaAPI = requrie('BugzillaAPI');
//var bz = new BugzillaAPI("ThisFakeEmail@gmail.com", "MyPass1234", 'http://bugzilla.ThisFakeCompany.com/');
//bz.getBug(...
///     ...
//@author: Nasir Billoo<nasir.billoo@gmail.com>
///});

var BugzillaAPI = function (user, pass, url) {
    this.user = user;
    this.pass = pass;
    this.baseURL = url;
    this.path = '/xmlrpc.cgi';
    this.port = 80;
};

BugzillaAPI.prototype = {
    getBug: function (bugid, cb) {
        var client = xmlrpc.createClient({
            host: this.baseURL,
            port: this.port,
            path: this.path,
            cookies: true,
            basic_auth: {
                user: this.user,
                pass: this.pass
            }
        })

        var loginData = [{
            login: this.user,
            password: this.pass,
            remember: 0
        }];

        client.methodCall('User.login', loginData, function (error, loginCookie) {
            if (error) {
                console.log("Error in login: " + error);
                cb(error, null);
            } else {
                //client.setCookie(loginCookie);
                var options = [{
                    'ids': bugid,
                    'token': loginCookie.token
                }];
                client.methodCall('Bug.get', options, function (error, bug) {
                    if (error) {
                        console.log("Error in Bug.get: " + error);
                        cb(error, null);
                    } else {
                        cb(null, bug);
                    }
                });
            }
        });
    },
    createNewBZ: function (bzParams, cb) {
        var client = xmlrpc.createClient({
            host: this.baseURL,
            port: this.port,
            path: this.path,
            cookies: true,
            basic_auth: {
                user: this.user,
                pass: this.pass
            }
        })

        var loginData = [{
            login: this.user,
            password: this.pass,
            remember: 0
        }];

        client.methodCall('User.login', loginData, function (error, loginCookie) {
            if (error) {
                console.log("Error in login: " + error);
                cb(error, null);
            } else {
                //client.setCookie(loginCookie);
                //bzParams.token = loginCookie.token
                var options = [{
                    summary: bzParams.summary,
                    description: bzParams.description,
                    priority: bzParams.priority,
                    severity: bzParams.severity,
                    product: bzParams.product,
                    cf_td_num: bzParams.cf_td_num,
                    status: bzParams.status,
                    component: bzParams.component,
                    assigned_to: bzParams.assigned_to,
                    version: bzParams.version,
                    op_sys: bzParams.op_sys,
                    platform: bzParams.platform,
                    token: loginCookie.token
                }];
                if (bzParams.resolution && bzParams.resolution.trim() !== "") {
                    options[0].resolutions = bzParams.resolution;
                }
                //console.log(options);
                //var options = [{'ids':bugid, 'token':loginCookie.token}];
                client.methodCall("Bug.create", options, function (error, bug) {
                    if (error) {
                        console.log("Error in Bug.create: " + error);
                        cb(error, null);
                    } else {
                        cb(null, bug);
                    }
                });
            }

        })
    },
    createComment: function (bzNum, comment, cb) {
        var client = xmlrpc.createClient({
            host: this.baseURL,
            port: this.port,
            path: this.path,
            cookies: true,
            basic_auth: {
                user: this.user,
                pass: this.pass
            }
        })

        var loginData = [{
            login: this.user,
            password: this.pass,
            remember: 0
        }];

        client.methodCall('User.login', loginData, function (error, loginCookie) {
            if (error) {
                console.log("Error in login: " + error);
                return cb(error, null);
            } else {
                var options = [{
                    id: bzNum,
                    comment: comment,
                    token: loginCookie.token
                }];
                //console.log(options);
                client.methodCall("Bug.add_comment", options, function (error, result) {
                    if (error) {
                        return cb(error, null);
                    } else {
                        return cb(null, result);
                    }
                });
            }

        })
    },
    createAttachment: function (bzNum, params, cb) {
        var client = xmlrpc.createClient({
            host: this.baseURL,
            port: this.port,
            path: this.path,
            cookies: true,
            basic_auth: {
                user: this.user,
                pass: this.pass
            }
        })
        var loginData = [{
            login: this.user,
            password: this.pass,
            remember: 0
        }];
        client.methodCall('User.login', loginData, function (error, loginCookie) {
            if (error) {
                console.log("Error in login: " + error);
                return cb(error, null);
            } else {
                var buffer = new Buffer(params.data, 'base64');
                var options = [{
                    ids: [params.id],
                    data: buffer,
                    file_name: params.file_name,
                    summary: params.summary,
                    content_type: params.content_type,
                    token: loginCookie.token
                }];
                client.methodCall("Bug.add_attachment", options, function (error, result) {
                    if (error) {
                        console.log("In BugzillaAPI, createAttachment, error: " + error);
                        return cb(error, null);
                    } else {
                        return cb(null, result);
                    }
                });
            }

        })
    },

    getBugComments: function (bugid, cb) {
        var client = xmlrpc.createClient({
            host: this.baseURL,
            port: this.port,
            path: this.path,
            cookies: true,
            basic_auth: {
                user: this.user,
                pass: this.pass
            }
        })

        var loginData = [{
            login: this.user,
            password: this.pass,
            remember: 0
        }];

        client.methodCall('User.login', loginData, function (error, loginCookie) {
            if (error) {
                console.log("Error in login: " + error);
                return cb(error, null);
            } else {
                //client.setCookie(loginCookie);
                var options = [{
                    'ids': bugid,
                    'token': loginCookie.token
                }];
                client.methodCall('Bug.get', options, function (error, bug) {
                    if (error) {
                        console.log("Error in Bug.get: " + error);
                        return cb(error, null);
                    } else {
                        return cb(null, bug);
                    }
                });
            }
        })
    },
    printMsg: function () {
        console.log("This module uses Bugzilla's XML RPC to do stuff");
    }
}
module.exports = BugzillaAPI;

