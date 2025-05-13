import Fastify, { FastifyInstance } from 'fastify'
import autoload from '@fastify/autoload'
import { join } from 'path'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { initConnection, restify } from '@src/index'
import { adminSchemas } from './admin-schemas'
import { userSchemas } from './user-schemas'

const defaultOptions = {
  logger: true,
  ignoreTrailingSlash: true,
}

async function buildApp(
  options: Partial<typeof defaultOptions> = {},
  uri: string
) {
  await initConnection()

  const app: FastifyInstance = Fastify({
    ...defaultOptions,
    ...options,
  }).withTypeProvider<TypeBoxTypeProvider>()

  app.register(autoload, {
    dir: join(__dirname, 'routes'),
    options: { prefix: '/api' },
  })

  // Stub: Hook for mrq-db-name
  app.addHook('onRequest', async (req) => {
    req['role'] = (req.query as { role: string }).role ?? 'admin'
    req['mrq-db-name'] = 'test'
  })

  app.register(
    restify({
      schemas: userSchemas,
      role: 'user',
    }),
    { prefix: '/secure/user/mrq' }
  )

  app.register(
    restify({
      schemas: adminSchemas,
      role: 'admin',
    }),
    { prefix: '/secure/admin/mrq' }
  )

  return app
}

export { buildApp }
