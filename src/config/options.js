module.exports = {
  debug: true,
  port: 80,
  dbName: 'project',
  MONGO_URL: process.env.MONGO_URL || 'mongodb://' +
    process.env.MONGO_PORT_27017_TCP_ADDR +
    ':' + process.env.MONGO_PORT_27017_TCP_PORT +
    '/' + this.dbName,
  folders: {
    models: __dirname + '/../models/'
  }
}
