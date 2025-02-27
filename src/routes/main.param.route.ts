import { FastifyInstance } from 'fastify'
import { ISchemaOption } from '../mrq.interfaces'
import { getMainParamHandler } from '../handler/main.param.handler'

export const mainParamRoute =
  (modelName: string, schemaOptions: Omit<ISchemaOption, 'endpointName'>) =>
  async (app: FastifyInstance) => {
    const { schema, handlerAccesses } = schemaOptions

    const mainParamHandler = getMainParamHandler(modelName, handlerAccesses)

    app.get(`/:id`, mainParamHandler.getById)

    app.put(`/:id`, mainParamHandler.updateById)

    app.put(`/:id/overwrite`, mainParamHandler.updateById)
  }
