import { FastifyInstance } from 'fastify'
import { IRestOptions } from './mrq.interfaces'
import { assignModelsHook } from './hooks/assign-models.hook'
import { closeConnections } from './utils/db.utils'
import { mainRoute } from './routes/main.route'
import { getSingleConnection } from './utils/db.utils'

export * from './mrq.errors'
export * from './mrq.interfaces'
export * from './mrq.enum'
export * from './utils/db.utils'

export const restify = (opts: IRestOptions) => async (app: FastifyInstance) => {
  await getSingleConnection(app, opts)

  app.addHook('onRequest', assignModelsHook(app, opts))

  app.addHook('onRoute', ({ url, method }) =>
    app.log.info(`Endpoint created: ${url} ${method}`)
  )

  app.addHook('onClose', closeConnections)

  app.register(mainRoute(opts))
}
