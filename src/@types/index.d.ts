import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    models: any
    'x-client-mongodb-path': string
  }
}
