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

var Webserver = exports.Webserver = function(options){

  for (var o in options) {
    this[o] = options[o];
  }

  Hook.call(this);

  var self = this;
  
  self.options.client = null;

  // on ready, start up the httpServer
  self.on('ready', function(){
    self._startHTTPServer();
  });
  
};

// Webserver inherits from Hook
util.inherits(Webserver, Hook);

Webserver.prototype._startHTTPServer = function(){

    var self = this;

    self.on('i.*', function(source, ev, data){
      self.sendToBrowser(source, ev, data);
    });

    self.on('o.*', function(source, ev, data){
      self.sendToBrowser(source, ev, data);
    });

    var file = new(static.Server)(__dirname + '/../public/', { AutoIndex: true, cache: 3600 }); 


    var server = http.createServer(function (req, res) {

      //
      // If basicAuth options were set when the Webserver was constructed
      //
      if (self.options.basicAuth) {

         var creds = req.headers.authorization || 'Basic bWFyYWs6Zm9vYmFy';
         creds = creds.split(' ');
         creds = helpers.base64.decode(creds[1]);
         creds = creds.split(':');
         if (creds[0] === self.options.basicAuth.username && creds[1] === self.options.basicAuth.password) {
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

      self.options.client = client;

      this.input = function (source, event, data) {
        self.emit(source, event, data);
      };

    }).listen(server);

    server.listen(self.options.port);
    console.log('http://localhost:/' + self.options.port);


};


Webserver.prototype.sendToBrowser = function(source, ev, data){

  var self = this;

  // TODO: move this to the on connected event instead of here, oops
  self.options.client.report(self.name);

  self.options.client.input(source, ev, data);

};


var helpers = {};

helpers.base64 = {};

helpers.base64.encode = function (unencoded) {
  return new Buffer(unencoded || '').toString('base64');
};

helpers.base64.decode = function (encoded) {
  return new Buffer(encoded || '', 'base64').toString('utf8');
};