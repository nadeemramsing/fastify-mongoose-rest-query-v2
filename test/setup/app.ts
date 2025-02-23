import Fastify, { FastifyInstance } from 'fastify'
import autoload from '@fastify/autoload'
import { join } from 'path'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { restify } from '@src/index'
import { ResourceSchema } from './schemas'

const defaultOptions = {
  logger: true,
  ignoreTrailingSlash: true,
}

async function buildApp(options: Partial<typeof defaultOptions> = {}) {
  const app: FastifyInstance = Fastify({
    ...defaultOptions,
    ...options,
  }).withTypeProvider<TypeBoxTypeProvider>()

  app.register(autoload, {
    dir: join(__dirname, 'routes'),
    options: { prefix: '/api' },
  })

  app.register(restify, {
    prefix: '/fastify/api',
    schemas: {
      Resource: {
        endpointName: 'resources',
        schema: ResourceSchema,
      },
    },
  })

  return app
}

export { buildApp }
