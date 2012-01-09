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

  self.host             = self.host || '127.0.0.1';
  self.webroot          = self.webroot || '.'
  self.clientTimeout    = self.clientTimeout || 60000;

  self.on('hook::started', function(){
    self.findPort({ port: self.port }, function(err, port){
      self.port = port;
      self._startHTTPServer(callback);
    })
  });

  //
  // A list of currently connected clients
  //
  var clients = {};

  //
  // Broadcast every message to all clients and
  // Check how long it's been since we've heard from each client
  // If it's been more than clientTimeout, remove the client and send it a timeout message
  //
  self.on("**", function(data, callback){

    if(self.client && self.client.message){

      if(this.event == "hook::ready"){
        clients[self.client.ident] = self.client;
      }

      for(c in clients){
        // if we find the same client that sent the message update their lastHeard time and callback
        if(self.client.ident == clients[c].ident){
          clients[c].lastHeard = new Date().getTime();
          self.client.message("webserver::" + this.event, data, callback);
        } else {
          if((new Date().getTime() - clients[c].lastHeard) > self.clientTimeout){
            clients[c].message("webserver::timeout", {lastHeard: clients[c].lastHeard, timeout: self.clientTimeout});
            delete clients[c];
          } else {
            clients[c].message("webserver::" + this.event, data);
          }
        }
      }

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
        //
        // Remark: Re-emits the browser event to your hook cloud
        //
        self.emit(event, data, callback);
      };
    }).listen(server);

    server.listen(self.port, function(err, result){
      if (err) {
        self.emit('webserver::error', error);
        return;
      }
      self.emit('webserver::started', self.port);
    });

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