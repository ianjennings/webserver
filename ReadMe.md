# hook.io-webserver

a basic hook.io enabled webserver with socket.io browser bridge

## Features

  - Provides hook.io event support to browsers
  - Acts as a static file server
  - Built-in Basic Auth options
  - Extends [hook.io](http://github.com/marak/hook.io) `Hook` prototype
  - Comes with built in browser broadcast demo
  - Uses [socket.io](http://socket.io) for browser transport

# Installation

     npm install hook.io-webserver

# How does it work?

hook.io-webserver creates an http server for browsers to connect to. Once connected, these browsers can send and receive messages to the server and each other with websocket support. But...that is boring. Anyone anyone can that. 

In addition to standard cross-browser websockets, hook.io-webserver itself extends the `Hook` prototype, which means it can easily connect to other hooks ( or have other hooks connect to it ) to seamlessly broadcast and re-broadcast messages. This means that you can now connect any browser to communicate with your hook.io cloud.

# Usage

**as a stand-alone binary**

    hookio-webserver
    
**programmatically**

``` javascript
    
var Webserver = require('hook.io-webserver').Webserver;

var webserver = new Webserver( { name: 'hook.io-webserver' });

webserver.on('hook::ready', function(){
  console.log('http web server started on port: ' + webserver.options.port);
});

webserver.start();
```

*Starts up a webserver which takes all incoming HTTP requests and emits the request headers and body to your hook.io cloud*