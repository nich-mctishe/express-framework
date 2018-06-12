require('docker-secrets-to-env')
require('./utils/watch')

const express = require('express')
const global = require('./config/options')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const graphqlHTTP = require('express-graphql')
const Schema = require('./schema/Master')

const MONGO_URL = process.env.MONGO_URL || 'mongodb://' +
  process.env.MONGO_PORT_27017_TCP_ADDR +
  ':' + process.env.MONGO_PORT_27017_TCP_PORT +
  '/project'

morgan.token('remote-addr', (req, res) => {
  return req.headers['x-forwarded-for'] || req.ip
})

mongoose
  .set('debug', true)
  .connect(MONGO_URL)
  .then(() => {
    Schema((err, schema) => {
      if (err) return console.error(err)
      console.log('graphql server starting at http://localhost/graphql')
      console.log('graphql-playground starting at http://localhost/debug')

      const app = express()

      app.use(bodyParser.urlencoded({ extended: true }))
      app.use(bodyParser.json())

      app.use('/graphql', graphqlHTTP({
        schema: schema,
        graphiql: false
      }))
      if (process.env.NODE_ENV !== 'production') {
        const expressPlayground = require('graphql-playground-middleware-express').default
        app.get('/debug', expressPlayground({ endpoint: '/graphql'}))
      }

      return app.listen(process.env.PORT || global.port)
    })
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

  /**
   * The below index structure  will work specifically for the Basic schema
   * NB: the const Schema will need to be amended so its required from ./schema/Basic
   */
  // mongoose
  //   .set('debug', true)
  //   .connect(MONGO_URL)
  //   .then(() => {
  //     // if (err) return console.error(err)
  //     console.log('graphql server starting at http://localhost/graphql')
  //     console.log('graphql-playground starting at http://localhost/playground')
  //
  //     const app = express()
  //
  //     app.use(bodyParser.urlencoded({ extended: true }))
  //     app.use(bodyParser.json())
  //
  //     app.use('/graphql', graphqlHTTP({
  //       schema: Schema,
  //       graphiql: false
  //     }))
  //     if (process.env.NODE_ENV !== 'production') {
  //       const expressPlayground = require('graphql-playground-middleware-express').default
  //       app.get('/debug', expressPlayground({ endpoint: '/graphql'}))
  //     }
  //
  //     return app.listen(process.env.PORT || 80)
  //   })
