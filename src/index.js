var express = require('express')
var app = express()

app.set('view engine', 'pug')
app.set('views', './templates/views')

app.use(express.static('public'))

require('./routes')(app)
require('./utils/watch')

app.listen(process.env.PORT || 80)
