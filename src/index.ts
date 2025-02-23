import { fastifyPlugin } from 'fastify-plugin'
import { IRestOptions } from './mrq.interfaces'
import { assignModelsHook } from './hooks/assign-models.hook'
import { closeConnections } from './utils/db.utils'
import { mainRoute } from './routes/main.route'

export const restify = fastifyPlugin(async (app, opts: IRestOptions) => {
  app.addHook('onRequest', assignModelsHook(app, opts.schemas))

  app.addHook('onRoute', ({ url, method }) =>
    app.log.info(`Endpoint created: ${url} ${method}`)
  )

  app.addHook('onClose', closeConnections)

  app.register(mainRoute, opts)
})
