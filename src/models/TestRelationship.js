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

let testSchema = new Schema({
  name: 'TestRelationship',
  data: {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    value: { type: Number, required: true }
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
// TC.addRelation(
//   'MoreTest',
//   {
//     resolver: MoreTestTC.getResolver('findById'),
//     prepareArgs: { // resolver `findById` has `_id` arg, let provide value to it
//       _id: (source) => source.draw
//     },
//     projection: { moreTest: 1 }, // point fields in source object, which should be fetched from DB
//   }
// )

module.exports = testSchema
