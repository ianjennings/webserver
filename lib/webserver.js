var Hook   = require('hook.io').Hook,
    http   = require('http'),
    fs     = require('fs'),
    union = require('union'),
    ecstatic = require('ecstatic'),
    optional = require('./optional'),
    basicAuth = require('./basicAuth'),
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

  self.on("**", function(data){
    if(self.client && self.client.message){
      self.client.message(this.event, data, callback);
    }
  });

};

// Webserver inherits from Hook
util.inherits(Webserver, Hook);

Webserver.prototype._startHTTPServer = function(callback){

    var self = this;

    //
    // Create a basic http server with union and ecstatic
    //
    var server = union.createServer({
      before: [
        optional(self.basicAuth,
          basicAuth(
            self.basicAuth && self.basicAuth.username,
            self.basicAuth && self.basicAuth.password
          )
        ),
        ecstatic(self.webroot, {
          autoIndex: true,
          cache: 3600
        })
      ]
    });

    dnode(function (client) {
      self.client = client;
      this.message = function (event, data, callback) {
        //
        // Remark: Re-emits the browser event to your hook cloud
        //
        self.emit(event, data, callback);
      };
    }).listen(server);

    server.listen(self.port);
    console.log('http server started', self.port, self.webroot);

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
