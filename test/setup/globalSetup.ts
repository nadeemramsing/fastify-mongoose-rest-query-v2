import { MongoMemoryServer } from 'mongodb-memory-server'
import { mongoInit } from '@test/setup/init/mongo.init'

let mongod: MongoMemoryServer

export async function setup() {
  mongod = await MongoMemoryServer.create({
    instance: {
      port: 27016,
    },
  })
  const uri = mongod.getUri()
  await mongoInit(uri)
}

export async function teardown() {
  await mongod.stop()
}
