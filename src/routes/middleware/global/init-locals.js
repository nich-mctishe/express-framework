module.exports = function (req, res, next) {
  var locals = {}

  locals.env = process.env.NODE_ENV
  locals.version = require('../../../package.json').dependencies.express
  locals.site = {
    name: 'Express',
    brand: 'Express'
  }

  var manifest = locals.env === 'production'
    ? require('../../../public/bundle/manifest.json')
    : null

  locals.bundle = function (path) {
    path = '/bundle/' + path
    return manifest && manifest[path] ? manifest[path] : path
  }

  res.locals = locals
  next()
}
