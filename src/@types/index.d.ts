import 'fastify'
import { Connection } from 'mongoose'
import './other-types-d'

declare module 'fastify' {
  interface FastifyRequest {
    mongooseConn: Connection
    role: string
    'mrq-db-name': string
  }
}

declare module 'mongoose' {
  interface Connection {
    securePathsPerModel: { [modelName: string]: { [path: string]: boolean } }
  }
}
