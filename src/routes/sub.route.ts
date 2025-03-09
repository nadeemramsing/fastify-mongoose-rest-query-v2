import { FastifyInstance } from 'fastify'
import { ISchemaOption } from '../mrq.interfaces'
import { getSubHandler } from '../handler/sub.handler'

export const subRoute =
  (modelName: string, schemaOptions: Omit<ISchemaOption, 'endpointName'>) =>
  async (app: FastifyInstance) => {
    const { schema, handlerAccesses } = schemaOptions

    for (const [subPathName, schemaInstance] of Object.entries(schema.obj)) {
      if (!Array.isArray(schemaInstance)) continue

      const subHandler = getSubHandler(modelName, subPathName, handlerAccesses)

      let prefix = `/${subPathName}`

      app.get(prefix, subHandler.getByQuery)

      app.get(`${prefix}/count`, subHandler.count)

      app.get(`${prefix}/distinct/:path`, subHandler.distinct)

      app.post(prefix, subHandler.create)

      app.put(prefix, subHandler.updateMany)

      app.put(`${prefix}/overwrite`, subHandler.updateMany)

      app.delete(prefix, subHandler.deleteByQuery)

      prefix += `/:subId`

      app.get(prefix, subHandler.getById)

      app.put(prefix, subHandler.updateById)

      app.put(`${prefix}/overwrite`, subHandler.updateById)
    }
  }
