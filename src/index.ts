import { fastifyPlugin } from 'fastify-plugin'
import { IRestOptions } from './mrq.interfaces'
import { assignModelsHook } from './hooks/assign-models.hook'

export const restify = fastifyPlugin(async (app, opts: IRestOptions) => {
  app.addHook('onRequest', assignModelsHook(app, opts.schemas))

  app.addHook('onRoute', ({ url, method }) =>
    app.log.info(`Endpoint created: ${url} ${method}`)
  )
})
