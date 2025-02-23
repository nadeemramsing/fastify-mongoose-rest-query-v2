import { FastifyInstance, onRequestHookHandler } from 'fastify'
import { IRestOptions } from '../mrq.interfaces'
import { getDB } from '../utils/db.utils'

export const assignModelsHook: (
  app: FastifyInstance,
  schemas: IRestOptions['schemas']
) => onRequestHookHandler = (app, schemas) => {
  app.decorateRequest('models', null)
  app.decorateRequest('x-client-mongodb-path', '')

  return (req, rep, done) => {
    req.models = getDB(req['x-client-mongodb-path'] as string, schemas)

    done()
  }
}
