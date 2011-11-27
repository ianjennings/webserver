module.exports = function (toggle, middleware) {
  var self = this;
  return function (req, res, next) {
    if (toggle) {
      middleware.call(self, req, res, next);
    } else {
      next();
    }
  }
}
