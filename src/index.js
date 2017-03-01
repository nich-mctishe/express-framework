var express = require('express')
var morgan = require('morgan')

var app = express()
var development = process.env.NODE_ENV === 'development'

app.set('view engine', 'pug')
app.set('views', './templates/views')

app.use(express.static('public'))
app.use(morgan(development ? 'dev' : 'common'))

require('./routes')(app)
require('./utils/watch')

app.listen(process.env.PORT || 80)
