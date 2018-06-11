const { composeWithMongoose } = require('graphql-compose-mongoose')
const Mongoose = require('mongoose')
const Schema = Mongoose.Schema
const _ = require('lodash')
const findOrCreate = require('mongoose-find-or-create')

/**
 * schema
 * interprets the data peice of the config parameter and builds a mongoose Schema
 * from it.
 * @param {Object} data
 *
 * @returns {Mongoose.Schema}
 */
const schema = (data) => {
  _.each(data, (field, name) => {
    if (_.isArray(field)) {
      _.each(field, (config, type) => {
        if (_.get(config, 'type') === 'id') {
          data[name][type].type = Schema.Types.ObjectId
        }
      })
    } else {
      if (_.get(field, 'type') === 'id') {
        data[name].type = Schema.Types.ObjectId
      }
    }
  })

  return new Schema(data)
}

/**
 * setup
 * sets a mongoose model based on the passed in config
 * @param {Object} instance
 *
 * @returns {Mongoose.model}
 */
const setup = (instance) => {
  console.log(instance.name + ' : ====')
  console.log(instance.customizationOptions)

  if (instance.preSave) {
    instance.schema.pre('save', this.preSave)
  }

  if (instance.hasPlugin) {
    instance.schema.plugin(findOrCreate)
  }

  if (_.get(instance.methods, 'length')) {
    _.each(instance.methods, (method, name) => {
      instance.schema.methods[name] = method
    })
  }

  return Mongoose.model(instance.name, instance.schema)
}

/**
 * @class Builder
 * Transforms passed in data as either a mongoose or graphql model
 */
let Builder =
class Builder {

  /**
   * constructor
   */
  constructor (config) {
    this.name = config.name
    this.schema = schema(config.data)
    this.hasPlugin = config.plugin
    this.preSave = config.preSave
    this.customizationOptions = config.customizationOptions
  }

  /**
   * GraphQL
   * returns a graphQL iteration of the database
   *
   * @return {GraphQL}
   */
  graphQL () {
    return composeWithMongoose(setup(this), this.customizationOptions || {})
  }

  /**
   * Mongoose
   * returns a mongoose iteraction of the database
   *
   * @returns {Mongoose.model}
   */
  mongoose () {
    return setup(this)
  }

  /**
   * Debug
   * returns information about the classs that is required
   *
   * @returns {Builder}
   */
  debug () {
    return this
  }
}

module.exports = Builder
