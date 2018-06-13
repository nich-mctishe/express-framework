/**
 * This schema can be assingned as an invidividual model based schema in case
 * a more simplified model approach is required
 */
const Mongoose = require('mongoose')
const Schema = Mongoose.Schema
const findOrCreate = require('mongoose-find-or-create')
const { composeWithMongoose } = require('graphql-compose-mongoose')
const { GQC } = require('graphql-compose')

let testSchema = new Schema({
  name: { type: String, index: true },
  slug: { type: String, index: true },
  value: { type: Number, index: true }
})

testSchema.plugin(findOrCreate)

let Test = Mongoose.model('Test', testSchema)

const customizationOptions = {} // left it empty for simplicity, described below
const TestTC = composeWithMongoose(Test, customizationOptions)

GQC.rootQuery().addFields({
  userById: TestTC.getResolver('findById'),
  userByIds: TestTC.getResolver('findByIds'),
  userOne: TestTC.getResolver('findOne'),
  userMany: TestTC.getResolver('findMany'),
  userCount: TestTC.getResolver('count'),
  userConnection: TestTC.getResolver('connection'),
  userPagination: TestTC.getResolver('pagination')
})

GQC.rootMutation().addFields({
  userCreate: TestTC.getResolver('createOne'),
  userUpdateById: TestTC.getResolver('updateById'),
  userUpdateOne: TestTC.getResolver('updateOne'),
  userUpdateMany: TestTC.getResolver('updateMany'),
  userRemoveById: TestTC.getResolver('removeById'),
  userRemoveOne: TestTC.getResolver('removeOne'),
  userRemoveMany: TestTC.getResolver('removeMany')
})

// TestTC.addRelation(
//   'compliments',
//   {
//     resolver: FoodTC.getResolver('findByIds'),
//     prepareArgs: { // resolver `findById` has `_id` arg, let provide value to it
//       _ids: (source) => source.compliments
//     },
//     projection: { compliments: 1 }, // point fields in source object, which should be fetched from DB
//   }
// )

const graphqlSchema = GQC.buildSchema()
module.exports = graphqlSchema
