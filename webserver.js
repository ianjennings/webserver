#! /usr/bin/env node
var Hook = require('hook.io').Hook;

var webserver = new Hook( {
  name: 'webserver'
});

webserver.connect({
  port: 5000,
  host: "localhost"
});

webserver.on('ready', function(){
  
  var http = require('http');
  var fs = require('fs');

  var index = fs.readFileSync(__dirname + '/index.html');

  var server = http.createServer(function (req, res) {
      if (req.url === '/') {
          res.writeHead(200, { 'Content-Type' : 'text/html' });
          res.end(index);
      }
      else if (!res.finished) {
          process.nextTick(function () {
              if (!res.finished) {
                  res.setCode = 404;
                  res.setHeader('content-type', 'text/html');
                  res.end('not found');
              }
          });
      }
  });

  webserver.listen({server: server});
  server.listen(8080);
  console.log('http://localhost:8080/');
  
});


