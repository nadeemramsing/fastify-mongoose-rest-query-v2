import { RouteHandlerMethod } from 'fastify'
import { model } from '../utils/db.utils'
import { leanOptions } from '../mrq.config'
import { getQuery } from '../utils/query.utils'

export const getMainHandler = (modelName: string) => {
  const getByQuery: RouteHandlerMethod = async (req, rep) => {
    const Model = model(req, modelName)

    const query = getQuery(req.query)

    const docs = await Model.find(query.filter, {}, { req })
      .select(query.select)
      .populate(query.populate)
      .sort(query.sort)
      .collation({ locale: 'en', caseLevel: true })
      .limit(query.limit)
      .skip(query.skip)
      .lean(leanOptions)

    return docs
  }

  return {
    getByQuery,
  }
}
