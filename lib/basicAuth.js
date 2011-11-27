
module.exports = function (un, pwd) {
  var username = un || "admin",
      password = pwd || "admin";

  return function (req, res, next) {
    var creds = req && req.headers && req.headers.authorization;

    if (creds) {
      creds = creds.split(' ');
      creds = helpers.base64.decode(creds[1]);
      creds = creds.split(':');
    }

    if (creds[0] === username && creds[1] === password) {
      res.emit("next");
    } else {
      res.writeHead(401, {
        'WWW-Authenticate': 'Basic realm="Secure Area"'
      });
      res.end();
    }
  }
}
