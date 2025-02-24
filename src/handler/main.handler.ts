import { RouteHandlerMethod } from 'fastify'
import { model } from '../utils/db.utils'
import { leanOptions } from '../mrq.config'

export const getMainHandler = (modelName: string) => {
  const getByQuery: RouteHandlerMethod = async (req, rep) => {
    const Model = model(req, modelName)

    const docs = await Model.find({}, {}, { req }).lean(leanOptions)

    return docs
  }

  return {
    getByQuery,
  }
}
