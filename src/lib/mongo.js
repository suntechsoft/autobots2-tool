import mongo from 'mongodb'
import config from '../../config/common'

export default class Mongo {
  
  constructor({ connectionUrl, dbName }) {
    this.dbName = dbName || config.mongo.db
    if (connectionUrl)
      this.connectionUrl = connectionUrl
    else if (config.mongo.url)
      this.connectionUrl = config.mongo.url
    else {
      this.connectionUrl = 'mongodb://'
      if (config.mongo.user && config.mongo.password)
        this.connectionUrl += `${config.mongo.user}:${config.mongo.password}@`
      if (config.mongo.host && config.mongo.port)
        this.connectionUrl += `${config.mongo.host}:${config.mongo.port}/${this.dbName}`
      if (config.mongo.authDb)
        this.connectionUrl += `?authSource=${config.mongo.authDb}`
    }
  }
  
  async getClient() {
    if (!this.client)
      console.log('Connecting to MongoDB with URL:', this.connectionUrl)
      this.client = await mongo.MongoClient.connect(this.connectionUrl, {
        keepAlive: true,
        connectTimeoutMS: 600000,
        socketTimeoutMS: 600000,
        reconnectTries: 30000,
        useNewUrlParser: true
      })
      .catch(async e => {
        console.error('Create MongoDB client error:', e)
        return await this.getClient()
      })
    return this.client
  }
  
  async getDb() {
    await this.getClient()
    return this.db = this.client.db(this.dbName)
  }
  
  async close(force = false) {
    await this.client.close(force)
    .catch(e => console.error('Close MongoDB client error:', e))
  }
  
  async count(collection, criteria, options) {
    return await this.db.collection(collection).countDocuments(criteria, options)
    .catch(e => console.error('Count in MongoDB error:', e))
  }

  async findOne(collection, criteria, options) {
    return await this.db.collection(collection).findOne(criteria, options)
        .catch(e => console.error('Find in MongoDB error:', e))
  }

  async find(collection, criteria, options) {
    return await this.db.collection(collection).find(criteria, options).toArray()
    .catch(e => console.error('Find in MongoDB error:', e))
  }
  
  async aggregate(collection, pipeline, options) {
    return await this.db.collection(collection).aggregate(pipeline, options).toArray()
    .catch(e => console.error('Aggregate in MongoDB error:', e))
  }
  
  async remove(collection, criteria) {
    return await this.db.collection(collection).remove(criteria)
    .catch(e => console.error('Remove from MongoDB error:', e))
  }
  
  async update(collection, criteria, update) {
    return await this.db.collection(collection).updateMany(criteria, update)
    .catch(e => console.error('Update in MongoDB error:', e))
  }
  
  static objectId(id) {
    return mongo.ObjectID(id)
  }
  
  static objectIdFromDate(timestamp = Date.now()) {
    return mongo.ObjectID(Math.floor(timestamp / 1000).toString(16) + '0000000000000000')
  }
  
}