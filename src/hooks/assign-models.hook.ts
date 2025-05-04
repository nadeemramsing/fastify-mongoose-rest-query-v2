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

  if (!app.hasRequestDecorator('x-client-mongodb-path')) {
    app.decorateRequest('x-client-mongodb-path', '')
  }

  return async (req) => {
    req.mongooseConn = await getDB(
      app,
      req['x-client-mongodb-path'] as string,
      opts.schemas
    )
  }
}
