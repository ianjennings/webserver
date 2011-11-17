//
// A simple CLI tool for helping to browserify /browser/hook-shim.j
//

var browserify = require('browserify'),
    colors     = require('colors')
    fs         = require('fs');

//
// In-case the generation script breaks,
// throw a friendly error
//
process.on('uncaughtException', function(err){
  console.log('error generating hook.js script!\n'.red + err.message.red);
  process.exit();
});

var bundle = browserify();

console.log('Generating browser bundle...'.yellow);

//
// Use ES5 shim for older browsers
//
bundle.use(require('shimify'));

//
// Require the main node.js entry point for jsonForm
//
bundle.require(__dirname + '/../lib/browser/hook-shim.js', { target:"/hook.js"});

//
// Read in some comments specifically for the browser,
// we'll append these to the browserified output
//
var comments = fs.readFileSync(__dirname + '/../lib/browser/comments.js').toString();
comments = comments.replace(/{{newDate}}/, new Date());
comments = comments.replace(/{{newDateUnix}}/, new Date().getTime());

//
// TODO: Also create a minified bundle using:
//       filter : require('uglify-js')


//
// Output the browser version of hook.io, hook.js
//

fs.writeFileSync(__dirname + '/../public/hook.js', comments + bundle.bundle());

console.log('Generated: '.green + 'hook.js'.magenta);

