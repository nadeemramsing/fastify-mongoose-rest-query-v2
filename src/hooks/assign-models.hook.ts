import { FastifyInstance, onRequestAsyncHookHandler } from 'fastify'
import { IModelToSchemaMap } from '../mrq.interfaces'
import { getDB } from '../utils/db.utils'

export const assignModelsHook: (
  app: FastifyInstance,
  modelToSchemaMap: IModelToSchemaMap
) => onRequestAsyncHookHandler = (app, modelToSchemaMap) => {
  if (!app.hasRequestDecorator('mrq-db-name')) {
    app.decorateRequest('mrq-db-name', '')
  }

  return async (req) => {
    req.mongooseConn = await getDB(
      app,
      req['mrq-db-name'] as string,
      modelToSchemaMap
    )
  }
}
