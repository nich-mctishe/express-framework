const { GQC } = require('graphql-compose')
const fs = require('fs')
const async = require('async')
const _ = require('lodash')
//  get all models
const modelFolder = __dirname + '/../models/'

const base = {
  query: {
    'byId': 'findById',
    'byIds': 'findByIds',
    'One': 'findOne',
    'Many': 'findMany',
    'Count': 'count',
    'Connection': 'connection',
    'Pagination': 'pagination'
  },
  mutation: {
    'Create': 'createOne',
    'UpdateById': 'updateById',
    'UpdateOne': 'updateOne',
    'UpdateMany': 'updateMany',
    'RemoveById': 'removeById',
    'RemoveOne': 'removeOne',
    'RemoveMany': 'removeMany'
  }
}

// get list of required models
const getModels = (callback) => {
  let models = {}
  fs.readdir(modelFolder, (err, files) => {
    async.eachSeries(files, (file, next) => {
      if (file !== '.DS_Store') {
        let name = file.replace('.js', '')
        models[name] = require('../models/' + name).graphQL
      }

      next()
    }, (err) => {
      if (err) return callback(err)

      return callback(null, models)
    })
  })
}

// build all fields
const getFields = (models, callback) => {
  let root = {
    query: {},
    mutation: {}
  }
  // get each base query types
  _.each(base, (fields, type) => {
    // get all fields in this type
    _.each(fields, (resolver, field) => {
      // apply resolver to each model
      _.each(models, (model, name) => {
        root[type][_.toLower(name) + field] = model.getResolver(resolver)
      })
    })
  })

  callback(null, root)
}

const getCustom = (fields, callback) => {
  return callback(null, fields)
}

module.exports = (next) => {
  async.waterfall([
    getModels,
    getFields,
    getCustom
  ], (err, results) => {
    if (err) return next(err)

    GQC.rootQuery().addFields(results.query)
    GQC.rootMutation().addFields(results.mutation)

    next(null, GQC.buildSchema())
  })
}
