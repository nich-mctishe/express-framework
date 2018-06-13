/**
 * Test model to get you started.
 * This model is purely a list of options passed to a schema to be
 * integrated with mongoose and graphql.
 *
 * all models will need to follow this format unless the Basic schema is being used
 * Feel free to duplicate or delete
 */

const Schema = require('../helpers/Schema')
const slugify = require('slugify')
const TestRelationshipTC = require('./TestRelationship')

let testSchema = new Schema({
  name: 'Test',
  data: {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    value: { type: Number, required: true },
    testRelationship: { type: 'id', ref: 'TestRelationship' }
  },
  // determines if should apply findOrCreate plugin
  hasPlugin: true,
  preSave: function (next) {
    this.slug = slugify(this.name)
    next()
  }
})

const TC = testSchema.graphQL()

// Use this to add a database relationto graph QL
TC.addRelation(
  'testRelationship',
  {
    resolver: TestRelationshipTC.graphQL().getResolver('findById'),
    prepareArgs: { // resolver `findById` has `_id` arg, let provide value to it
      _id: (source) => source.testRelationship
    },
    projection: { testRelationship: 1 } // point fields in source object, which should be fetched from DB
  }
)

module.exports = testSchema
