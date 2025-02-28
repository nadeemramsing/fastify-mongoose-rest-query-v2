import { FastifyInstance } from 'fastify'
import { ISchemaOption } from '../mrq.interfaces'
import { getMainParamHandler } from '../handler/main.param.handler'
import { mainParamSubarrayRoute } from './main.param.subarray.route'

export const mainParamRoute =
  (modelName: string, schemaOptions: Omit<ISchemaOption, 'endpointName'>) =>
  async (app: FastifyInstance) => {
    const { schema, handlerAccesses } = schemaOptions

    const mainParamHandler = getMainParamHandler(modelName, handlerAccesses)

    const prefix = `/:id`

    app.get(prefix, mainParamHandler.getById)

    app.put(prefix, mainParamHandler.updateById)

    app.put(`${prefix}/overwrite`, mainParamHandler.updateById)

    app.delete(prefix, mainParamHandler.deleteById)

    app.register(
      mainParamSubarrayRoute(modelName, { schema, handlerAccesses }),
      { prefix }
    )
  }
