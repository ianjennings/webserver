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
  
    var file = new(static.Server)(__dirname + '/../public/', { AutoIndex: true, cache: 3600 }); 
  

    var server = http.createServer(function (req, res) {
      file.serve(req, res);
    });

    dnode(function (client) {
      
      console.log(client);
      self.options.client = client;
      
      this.input = function (source, event, data) {
        self.emit(source, event, data);
      };
      
      
      self.on('i.*', function(source, ev, data){
        self.sendToBrowser(source, ev, data);
      });

      self.on('o.*', function(source, ev, data){
        self.sendToBrowser(source, ev, data);
      });


    }).listen(server);

    server.listen(self.options.port);
    console.log('http://localhost:/' + self.options.port);


};


Webserver.prototype.sendToBrowser = function(source, ev, data){

  var self = this;
  console.log('sending to das browser', source, ev, data);
  self.options.client.input(source, ev, data);

};