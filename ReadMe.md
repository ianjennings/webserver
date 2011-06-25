# hook.io-webserver

basic hook.io enabled static webserver with socket.io / dnode browser websocket gateway

## Features

  - Provides hook.io event support to browsers
  - Acts as a static file server
  - Built-in Basic Auth options
  - Extends [hook.io](http://github.com/marak/hook.io) `Hook` prototype
  - Comes with built in browser broadcast demo
  - Uses [socket.io](http://socket.io) for browser transport

# Installation

     npm install hook.io-webserver

# Usage

**as a stand-alone binary**

    hookio-webserver
    
**programmatically**

``` javascript
    
    var Webserver = require('hook.io-webserver').Webserver;

    var webserver = new Webserver( { name: 'hook.io-webserver', options: { port: 9000 } });

    webserver.on('ready', function(){
      console.log('http web server started on port: ' + webserver.options.port);
    });

    webserver.start();
```

*Starts up a webserver which takes all incoming HTTP requests and emits the request headers and body to your hook.io cloud*