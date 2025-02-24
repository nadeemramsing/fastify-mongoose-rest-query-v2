import { FastifyInstance, onRequestAsyncHookHandler } from 'fastify'
import { IRestOptions } from '../mrq.interfaces'
import { getDB } from '../utils/db.utils'

export const assignModelsHook: (
  app: FastifyInstance,
  schemas: IRestOptions['schemas']
) => onRequestAsyncHookHandler = (app, schemas) => {
  app.decorateRequest('models', null)
  app.decorateRequest('x-client-mongodb-path', '')

  return async (req, rep) => {
    req.mongoose_conn = await getDB(
      app,
      req['x-client-mongodb-path'] as string,
      schemas
    )
  }
}
