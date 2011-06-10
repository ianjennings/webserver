#! /usr/bin/env node
var Hook = require('hook.io').Hook;

var webserver = new Hook( {
  name: 'webserver'
});

webserver.connect({
  port: 5000,
  host: "localhost"
});

var browserify = require('browserify');


webserver.on('ready', function(){
  
  var connect = require('connect');
  var server = connect.createServer();

  server.use(connect.static(__dirname));
  server.use(browserify({ require : [ 'hook.io', 'dnode' ] }))

  webserver.listen({server: server});
  server.listen(8080);
  console.log('http://localhost:8080/');
  
});





