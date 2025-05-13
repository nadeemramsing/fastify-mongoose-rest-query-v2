import { FastifyInstance } from 'fastify'
import { IRestOptions } from './mrq.interfaces'
import { mainRoute } from './routes/main.route'

export * from './mrq.errors'
export * from './mrq.interfaces'
export * from './mrq.enum'
export * from './mrq.config'
export * from './utils/db.utils'
export * from './hooks/get-models.hook'

export const restify = (opts: IRestOptions) => async (app: FastifyInstance) => {
  app.register(mainRoute(opts))
}
