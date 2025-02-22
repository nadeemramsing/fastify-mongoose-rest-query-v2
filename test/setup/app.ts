import Fastify, { FastifyInstance } from 'fastify'
import autoload from '@fastify/autoload'
import { join } from 'path'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { PostgreSqlContainer } from '@testcontainers/postgresql'

const defaultOptions = {
  logger: true,
  ignoreTrailingSlash: true,
}

async function buildApp(options: Partial<typeof defaultOptions> = {}) {
  const container = await new PostgreSqlContainer().start()

  const app: FastifyInstance = Fastify({
    ...defaultOptions,
    ...options,
  }).withTypeProvider<TypeBoxTypeProvider>()

  app.register(autoload, {
    dir: join(__dirname, 'routes'),
    options: { prefix: '/api' },
  })

  console.log(container.getConnectionUri())

  container.stop()

  return app
}

export { buildApp }
