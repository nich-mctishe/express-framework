var async = require('async')
var http = require('http')

var check = [
  '/'
]

var doCheck = function (path, callback) {
  var options = {
    host: 'localhost',
    port: process.argv[2] || 80,
    path: path,
    timeout: 60 * 1000
  }

  var request = http.request(options, function (res) {
    console.log(`STATUS: ${res.statusCode} - ${path}`)
    if (res.statusCode === 200) {
      callback(null)
    } else {
      callback(new Error(path + ' error: ' + res.statusCode))
    }
  })

  request.on('error', callback)

  request.end()
}

async.each(check, doCheck, function (err) {
  process.exit(err ? 1 : 0)
})
