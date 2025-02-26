import { RouteHandlerMethod } from 'fastify'
import { httpErrors } from '@fastify/sensible'
import { model } from '../utils/db.utils'
import { leanOptions, toJSONOptions } from '../mrq.config'
import { getQuery } from '../utils/query.utils'
import { HandlerAccessEnum } from '../mrq.enum'
import { runStaticMethods, useSession } from '../utils/mongoose.utils'
import {
  PATH_NOT_FOUND_IN_SCHEMA,
  ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL,
} from '../mrq.errors'
import { ClientSession } from 'mongoose'

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

  // ---

  const distinct: RouteHandlerMethod = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.DISTINCT))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL)

    const params = req.params as { path: string }

    const Model = model(req, modelName)

    const doesPathExists = Model.schema.path(params.path)

    if (!doesPathExists) throw httpErrors.notFound(PATH_NOT_FOUND_IN_SCHEMA)

    const query = getQuery(req.query, { ignoreSelect: true })

    return Model.distinct(params.path, query.filter)
  }

  // ---

  const create: RouteHandlerMethod = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.CREATE))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL)

    const Model = model(req, modelName)

    let body: any = req.body

    const isBodyAnArray = Array.isArray(body)

    if (isBodyAnArray && !body.length)
      throw httpErrors.notFound('invalid_body: no object found in array')

    if (!isBodyAnArray) body = [body]

    const docs = await useSession(Model, req, (session?: ClientSession) =>
      Model.create(body, { req, session })
    )

    const result = docs.map((doc: any) => doc.toJSON(toJSONOptions))

    return isBodyAnArray ? result : result[0]
  }

  return {
    getByQuery,
    count,
    distinct,
    create,
  }
}
