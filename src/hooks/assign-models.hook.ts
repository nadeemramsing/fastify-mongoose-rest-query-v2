import { FastifyInstance, onRequestAsyncHookHandler } from 'fastify'
import { IRestOptions } from '../mrq.interfaces'
import { getDB } from '../utils/db.utils'

export const assignModelsHook: (
  app: FastifyInstance,
  opts: IRestOptions
) => onRequestAsyncHookHandler = (app, opts) => {
  if (!app.hasRequestDecorator('models')) {
    app.decorateRequest('models', null)
  }

  if (!app.hasRequestDecorator('mrq-db-name')) {
    app.decorateRequest('mrq-db-name', '')
  }

  return async (req) => {
    req.mongooseConn = await getDB(
      app,
      req['mrq-db-name'] as string,
      opts.schemas
    )
  }
}
