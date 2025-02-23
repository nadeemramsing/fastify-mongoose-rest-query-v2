import { fastifyPlugin } from 'fastify-plugin'
import { IRestOptions } from '../mrq.interfaces'
import { mainHandler } from '../handler/main.handler'

export const mainRoute = fastifyPlugin<IRestOptions>(async (app, opts) => {
  for (const [modelName, { endpointName, schema }] of Object.entries(
    opts.schemas
  )) {
    const prefix = `${opts.prefix}/${endpointName}`

    app.get(prefix, mainHandler)
  }
})
