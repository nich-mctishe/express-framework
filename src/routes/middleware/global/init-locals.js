module.exports = function (req, res, next) {
  var locals = {}

  locals._ = require('lodash')

  locals.env = process.env.NODE_ENV
  locals.version = require('../../../package.json').dependencies.express
  locals.site = {
    name: process.env.SITE_NAME || 'Express',
    brand: process.env.SITE_BRAND || 'Express'
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
