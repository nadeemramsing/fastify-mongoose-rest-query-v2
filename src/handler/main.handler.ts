import { RouteHandlerMethod } from 'fastify'
import { httpErrors } from '@fastify/sensible'
import { model } from '../utils/db.utils'
import { leanOptions } from '../mrq.config'
import { getQuery } from '../utils/query.utils'
import { HandlerAccessEnum } from '../mrq.enum'
import { ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL } from '../mrq.errors'
import { runStaticMethods } from '../utils/mongoose.utils'

export const getMainHandler = (
  modelName: string,
  handlerAccesses: HandlerAccessEnum[] = []
) => {
  const getByQuery: RouteHandlerMethod = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.GET_BY_QUERY))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL)

    const Model = model(req, modelName)

    const query = getQuery(req.query)

    const docs = await Model.find(query.filter, query.select, { req })
      .populate(query.populate)
      .sort(query.sort)
      .collation({ locale: 'simple', caseLevel: true })
      .limit(query.limit)
      .skip(query.skip)
      .lean(leanOptions)

    runStaticMethods({ Model, docs, query, req })

    return docs
  }

  // ---

  const count: RouteHandlerMethod = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.COUNT))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL)

    const Model = model(req, modelName)

    const query = getQuery(req.query, { ignoreSelect: true })

    return { n: await Model.countDocuments(query.filter) }
  }

  // --

  return {
    getByQuery,
    count,
  }
}
