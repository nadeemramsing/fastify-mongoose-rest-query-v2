import 'fastify'
import { Connection } from 'mongoose'

declare module 'fastify' {
  interface FastifyRequest {
    mongoose_conn: Connection
    'x-client-mongodb-path': string
  }
}
