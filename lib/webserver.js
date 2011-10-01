var Hook   = require('hook.io').Hook,
    http   = require('http'),
    fs     = require('fs'),
    static = require('node-static'),
    util   = require('util');

//
// TODO: create a Hook.io browser hook with browserify,
// instead of requiring dnode directly here
//
var dnode = require('dnode');

var Webserver = exports.Webserver = function(options, callback){

  var self = this;

  Hook.call(self, options);

  self.port    = self.port || 9000;
  self.host    = self.host || '127.0.0.1';
  self.webroot = self.webroot || '.'

  self.on('hook::started', function(){
    self._startHTTPServer(callback);
  });

  self.onAny(function(data){
    var parts = this.event.split('::');
    if(parts[0] !== 'browser' && parts[0] !== 'browser'){
      self.sendToBrowser('browser::' + this.event, data, callback);
    }
  });

};

// Webserver inherits from Hook
util.inherits(Webserver, Hook);

Webserver.prototype._startHTTPServer = function(callback){

    var self = this;

    //
    // Create a basic static http request handler using node-static
    //
    var file = new(static.Server)(self.webroot, { AutoIndex: true, cache: 3600 });

    //
    // Create a basic http server
    //
    var server = http.createServer(function (req, res) {

      //
      // If basicAuth options were set when the Webserver was constructed,
      // then we will require basic auth to view the webserver.
      // Hardcoded username:password pair is currently, "admin:admin"
      //
      if (self.basicAuth) {
         var creds = req.headers.authorization || 'Basic bWFyYWs6Zm9vYmFy';
         creds = creds.split(' ');
         creds = helpers.base64.decode(creds[1]);
         creds = creds.split(':');
         if (creds[0] === self.basicAuth.username && creds[1] === self.basicAuth.password) {
           file.serve(req, res);
         }
         else {
           res.writeHead(401, {
             'WWW-Authenticate': 'Basic realm="Secure Area"'
             });
           res.end('');
         }
      }
      else {
        file.serve(req, res);
      }
    });

    dnode(function (client) {
      self.client = client;
      this.message = function (event, data, callback) {
        self.emit(event, data, callback);
      };
    }).listen(server);

    server.listen(self.port);
    console.log('http server started', self.port, self.webroot);

};


Webserver.prototype.sendToBrowser = function(ev, data, callback){

  var self = this;

  // TODO: move this to the on connected event instead of here, oops
  try {
    self.client.report(self.name);
    self.client.message(ev, data, callback);
  } catch(err){
    
  }

};


//
// Simple base64 helper
//
var helpers = {};

helpers.base64 = {};

helpers.base64.encode = function (unencoded) {
  return new Buffer(unencoded || '').toString('base64');
};

helpers.base64.decode = function (encoded) {
  return new Buffer(encoded || '', 'base64').toString('utf8');
};