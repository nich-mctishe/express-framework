var fs = require('fs')
var path = require('path')
var _ = require('lodash')
var express = require('express')
var app = express.Router()

var walkSync = function (dir, filelist) {
  var files = fs.readdirSync(path.join(__dirname, dir))
  filelist = filelist || []
  _.each(files, function (file) {
    var p = path.join(dir, file)
    var pFull = path.join(__dirname, p)
    if (fs.statSync(pFull).isDirectory()) {
      filelist = walkSync(p, filelist)
    } else {
      filelist.push(p)
    }
  })
  return _.filter(filelist, function (p) {
    return p.substr(-3) === '.js'
  })
}

var middleware = walkSync('./middleware/global')

_.each(_.values(middleware), function (p) {
  app.all('*', require('./' + p))
})

module.exports = app
