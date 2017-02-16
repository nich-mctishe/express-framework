var express = require('express')
var app = express.Router()

app.get('/', require('./views/index'))

module.exports = app
