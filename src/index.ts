import { FastifyInstance } from 'fastify'
import { IRestOptions } from './mrq.interfaces'
import { assignModelsHook } from './hooks/assign-models.hook'
import { mainRoute } from './routes/main.route'

export * from './mrq.errors'
export * from './mrq.interfaces'
export * from './mrq.enum'
export * from './mrq.config'
export * from './utils/db.utils'

export const restify = (opts: IRestOptions) => async (app: FastifyInstance) => {
  // app.addHook('onRequest', assignModelsHook(app, opts))

  app.register(mainRoute(opts))
}
