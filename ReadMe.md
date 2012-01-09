# hook.io-webserver

a basic [hook.io](http://hook.io) enabled webserver with a [socket.io](http://socket.io)  based browser bridge

# EXPERIMENTAL BROADCAST VERSION

``` 
git clone git@github.com:ianjennings/webserver.git
cd webserver
./bin/webserver
```
Then visit http://localhost:8000 in two browser tabs. The pings seen are coming from the server and should appear in both browser tabs at the same time.

## Events

All events that are broadcast by the webserver hook are prepended with ```browser::{conn.id}```. This makes it easy to distinguish from local events and broadcasted events and identify where the message came from.

## Private Events

Events that are emitted with the prefix ```private::``` will NOT be broadcast. Only the client that emits the event will recieve the callback.

## Features

  - Provides a cross-browser bridge to [hook.io](http://hook.io) through [socket.io](http://socket.io)
  - Acts as a static file server
  - Built-in Basic Auth options
  - Designed to provide a minimal browser-bridge to hook.io ( no extra cruft )

### Note: For a more full-featured hook.io browser bridge, check out the [hook.js](http://github.com/hookio/hook.js/) project.

# Installation

     npm install hook.io-webserver -g

# How does it work?

hook.io-webserver creates an http server for browsers to connect to. Once connected, these browsers can send and receive messages to the server and each other with websocket support. But...that is boring. Anyone can do that. 

     http://localhost:8000/

In addition to standard cross-browser websockets, `hookio-webserver` itself extends the `Hook` prototype, which means it can easily connect to other hooks ( or have other hooks connect to it ) to seamlessly broadcast and re-broadcast messages. This means that you can now connect any browser to communicate with your hook.io network.

# When to use?

`hookio-webserver` is the bare minimal for component required for opening up a [socket.io](http://socket.io) based websocket server which communicates with hook.io. If you are looking to build a full-featured real-time web application with hook.io, you should use the [hook.js](http://github.com/hookio/hook.js/) project.

# Usage

**as a stand-alone binary**

    hookio-webserver
    
**programmatically**

``` javascript
    
var Webserver = require('hook.io-webserver').Webserver;

var webserver = new Webserver({
  name: 'hook.io-webserver',
  webroot: './public'
});

webserver.start();
```

*Starts up a webserver which can accept websocket connections through dnode and socket.io*