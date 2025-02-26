import { RouteHandlerMethod } from 'fastify'
import { httpErrors } from '@fastify/sensible'
import { model } from '../utils/db.utils'
import { leanOptions } from '../mrq.config'
import { getQuery } from '../utils/query.utils'
import { HandlerAccessEnum } from '../mrq.enum'
import { ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL } from '../mrq.errors'

export const getMainHandler = (
  modelName: string,
  handlerAccesses: HandlerAccessEnum[] = []
) => {
  const getByQuery: RouteHandlerMethod = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.GET_BY_QUERY))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL)

    const Model = model(req, modelName)

    const query = getQuery(req.query)

    const docs = await Model.find(query.filter, {}, { req })
      .select(query.select)
      .populate(query.populate)
      .sort(query.sort)
      .collation({ locale: 'simple', caseLevel: true })
      .limit(query.limit)
      .skip(query.skip)
      .lean(leanOptions)

    return docs
  }

  return {
    getByQuery,
  }
}
