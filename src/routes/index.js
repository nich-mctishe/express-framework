exports = module.exports = function (app) {
  // load middleware
  app.use(function (req, res, next) {
    require('./middleware')(req, res, next)
  })
  // load application routes
  app.use(function (req, res, next) {
    require('./app')(req, res, next)
  })
}
