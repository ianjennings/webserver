/*
 * hook-shim.js: A slimmed down minimal Hook.js class for the browser
 *
 * run './bin/browser' to convert this script to a browser friendly format
 * (C) 2011 Nodejitsu Inc.
 * MIT LICENCE
 *
 */

var dnode  = require('dnode'),
    path   = require('path'),
    EventEmitter = require('eventemitter2').EventEmitter2;


//
// Create a shim for the base hook.io Hook class
//
var Hook = exports.Hook = function (options) {
  self.reconnectionTimer = null;
  EventEmitter.call(this, { delimiter: '::', wildcard: true });
};

//
// Hook inherit from `EventEmitter2`.
//
inherits(Hook, EventEmitter);

Hook.prototype.connect = function () {

  var self = this;

  //
  // Create a dnode / socketio client which exposes,
  // a `message` function
  //
  var client = dnode({
    message: function(event, data){
      self.emit(event, data, function(){}, false);
    },
    report: function(message) {
    }
  });

  //
  // connect() will recursively call itself,
  // until a connection is ready
  //
  // When the connection ends connect() will,
  // continue to attempt to reconnect
  //
  //
  // connect() will recursively call itself,
  // until a connection is ready
  //
  // When the connection ends connect() will,
  // continue to attempt to reconnect
  //
  function connect() {
    client.connect(function (_remote, conn) {
        self.remote = _remote; 
        clearInterval(reconnectionTimer);
        conn.on('end', function(){
          //
          //  Attempt reconnection
          //
          reconnectionTimer = setInterval(function(){
            connect();
          }, 3000)
        });
        self.emit('hook::ready');
    });
  }
  connect();
};

Hook.prototype.start = function () {
  this.connect();
};


//
// Shim of Hook.prototype.emit from core hook.io project
//
//
// TODO: Remove all this copy and pasted code from Hook.emit and replace,
// with a require()
//

Hook.prototype.emit = function (event, data, callback, emit) {

  var self = this;
  //
  // Remark: `newListener` is reserved by EE and EE2,
  // if we encounter it, just fire EventEmitter.emit as normal,
  // with no arguments modifications
  //
  if (event === 'newListener') {
    return EventEmitter.prototype.emit.apply(this, arguments);
  }

  //
  // Log all emitted events
  //
  //self.log(this, event, data);

  //
  // Curry arguments to support multiple styles,
  // of callback passing.
  //
  if(typeof data === 'function') {
   callback = data;
   data = null;
  }

  if(typeof callback !== 'function') {
   //
   // Remark: If no callback has been sent,
   // attempt to auto-create a callback that emits,
   // based on the following convention:
   //
   //
   //  Since no callback function was detected, we are going to create a callback,
   //  that emits back the event name appended with either:
   //
   //         `event::result`  - Emitted when callback is fired without error
   //              OR
   //         `event::error`   - Emitted when callback is fired with an error
   //

   callback = function(err, result){
     if (err) {
       //
       // Remark: In addition to firing the `::error` event,
       // we set a property `ctx` of the error, which
       // contains the original data sent to the hook that caused,
       // the error in the first place. This is useful for debugging.
       //
       err.ctx = data;
       return self.emit(event + '::error', err);
     }
     result.ctx = data;
     return self.emit(event + '::result', result);
   };
  }

  if (self.remote) {
    //
    // If this call to emit has not been forced local and this instance has a
    // remote (i.e. parent) connection, then broadcast event back to the remote
    //

    //
    // Remark: Default dnode transport
    //
    // console.log(event, data);
    
    //console.log(emit, event, data);
    if (emit !== false) {
      this.remote.message(event, data, callback);
    }
    
  }

  //
  // Remark: After we process any hook.io messaging,
  // we still need to call the event, so fire it
  //
  return EventEmitter.prototype.emit.apply(this, [event, data, callback]);
}


//
// Simple Inherits from node.js core
//
function inherits (ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};
