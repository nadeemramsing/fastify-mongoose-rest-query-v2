import { fastifyPlugin } from 'fastify-plugin'
import { IRestOptions } from './mrq.interfaces'

export const restify = fastifyPlugin(async (app, opts: IRestOptions) => {
  app.addHook('onRoute', ({ url, method }) =>
    app.log.info(`Endpoint created: ${url} ${method}`)
  )
})
