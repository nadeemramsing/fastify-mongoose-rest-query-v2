import { FastifyInstance } from 'fastify'
import { IRestOptions } from '../mrq.interfaces'
import { getMainHandler } from '../handler/main.handler'
import { roleHook } from '../hooks/role.hook'

export const mainRoute =
  (opts: IRestOptions) => async (app: FastifyInstance) => {
    app.addHook('onRequest', roleHook(opts))

    for (const [
      modelName,
      { endpointName, schema, handlerAccesses },
    ] of Object.entries(opts.schemas)) {
      const prefix = `/${endpointName}`

      const mainHandler = getMainHandler(modelName, handlerAccesses)

      app.get(prefix, mainHandler.getByQuery)

      app.get(`${prefix}/count`, mainHandler.count)

      app.get(`${prefix}/distinct/:path`, mainHandler.distinct)

      app.post(prefix, mainHandler.create)

      app.put(prefix, mainHandler.updateMany)
    }
  }
