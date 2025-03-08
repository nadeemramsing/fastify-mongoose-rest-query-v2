import { FastifyInstance } from 'fastify'
import { ISchemaOption } from '../mrq.interfaces'
import { getMainParamSubarrayHandler } from '../handler/main.param.subarray.handler'

export const mainParamSubarrayRoute =
  (modelName: string, schemaOptions: Omit<ISchemaOption, 'endpointName'>) =>
  async (app: FastifyInstance) => {
    const { schema, handlerAccesses } = schemaOptions

    for (const [subPathName, schemaInstance] of Object.entries(schema.obj)) {
      if (!Array.isArray(schemaInstance)) continue

      const mainParamSubarrayHandler = getMainParamSubarrayHandler(
        modelName,
        subPathName,
        handlerAccesses
      )

      const prefix = `/${subPathName}`

      app.get(prefix, mainParamSubarrayHandler.getByQuery)

      app.get(`${prefix}/count`, mainParamSubarrayHandler.count)

      app.get(`${prefix}/distinct/:path`, mainParamSubarrayHandler.distinct)

      app.post(prefix, mainParamSubarrayHandler.create)

      app.put(prefix, mainParamSubarrayHandler.updateMany)

      app.put(`${prefix}/overwrite`, mainParamSubarrayHandler.updateMany)
    }
  }
