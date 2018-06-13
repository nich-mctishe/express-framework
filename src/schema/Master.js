const { GQC } = require('graphql-compose')
const async = require('async')
const _ = require('lodash')
const models = require('../helpers/models')

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
    async.apply(models.get, false),
    getFields,
    getCustom
  ], (err, results) => {
    if (err) return next(err)

    GQC.rootQuery().addFields(results.query)
    GQC.rootMutation().addFields(results.mutation)

    next(null, GQC.buildSchema())
  })
}
