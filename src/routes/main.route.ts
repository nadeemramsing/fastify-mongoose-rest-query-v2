import { FastifyInstance } from 'fastify'
import { IRestOptions } from '../mrq.interfaces'
import { getMainHandler } from '../handler/main.handler'
import { roleHook } from '../hooks/role.hook'
import { subRoute } from './sub.route'
import { getSubarray } from '../utils/mongoose.utils'

export const mainRoute =
  (opts: IRestOptions) => async (app: FastifyInstance) => {
    app.addHook('onRequest', roleHook(opts))

    for (const [
      modelName,
      { endpointName, schema, handlerAccesses },
    ] of Object.entries(opts.schemas)) {
      const mainHandler = getMainHandler(modelName, handlerAccesses)

      let prefix = `/${endpointName}`

      app.get(prefix, mainHandler.getByQuery)

      app.get(`${prefix}/count`, mainHandler.count)

      app.get(`${prefix}/distinct/:path`, mainHandler.distinct)

      app.post(prefix, mainHandler.create)

      app.put(prefix, mainHandler.updateMany)

      app.put(`${prefix}/overwrite`, mainHandler.updateMany)

      app.delete(prefix, mainHandler.deleteByQuery)

      prefix += `/:id`

      app.get(prefix, mainHandler.getById)

      app.put(prefix, mainHandler.updateById)

      app.put(`${prefix}/overwrite`, mainHandler.updateById)

      app.delete(prefix, mainHandler.deleteById)

      app.register(
        subRoute(modelName, {
          schema,
          handlerAccesses,
          getSubarray,
          subPathName: '',
          subIdName: 'subId',
        }),
        { prefix }
      )
    }
  }
