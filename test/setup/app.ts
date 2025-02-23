import Fastify, { FastifyInstance } from 'fastify'
import autoload from '@fastify/autoload'
import { join } from 'path'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { mongoInit } from '@test/setup/init/mongo.init'

declare module 'fastify' {
  interface FastifyInstance {
    mongod: MongoMemoryServer
  }
}

const defaultOptions = {
  logger: true,
  ignoreTrailingSlash: true,
}

async function buildApp(options: Partial<typeof defaultOptions> = {}) {
  const mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()
  await mongoInit(uri)

  const app: FastifyInstance = Fastify({
    ...defaultOptions,
    ...options,
  }).withTypeProvider<TypeBoxTypeProvider>()

  app.register(autoload, {
    dir: join(__dirname, 'routes'),
    options: { prefix: '/api' },
  })

  app.mongod = mongod

  return app
}

export { buildApp }
