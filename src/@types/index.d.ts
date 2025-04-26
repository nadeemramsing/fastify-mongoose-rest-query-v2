import 'fastify'
import { Connection } from 'mongoose'

declare module 'fastify' {
  interface FastifyRequest {
    mongoose_conn: Connection
    role: string
    'x-client-mongodb-path': string
  }
}

declare module 'mongoose' {
  interface Connection {
    securePathsPerModel: { [modelName: string]: { [path: string]: boolean } }
  }
}
