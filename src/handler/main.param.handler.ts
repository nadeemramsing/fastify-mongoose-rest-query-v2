import { RouteHandlerMethod } from 'fastify'
import { httpErrors } from '@fastify/sensible'
import { ClientSession, Document } from 'mongoose'
import { flatten } from 'flat'
import { model } from '../utils/db.utils'
import { leanOptions, toJSONOptions } from '../mrq.config'
import { getQuery } from '../utils/query.utils'
import { HandlerAccessEnum } from '../mrq.enum'
import {
  getArrayFromBodyWithId,
  runStaticMethods,
  useSession,
} from '../utils/mongoose.utils'
import {
  DOCUMENT_NOT_FOUND,
  IMPLICIT_DELETE_ALL_NOT_ALLOWED,
  INVALID_BODY,
  NO_DOCUMENT_FOUND,
  PATH_NOT_FOUND_IN_SCHEMA,
  ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL,
} from '../mrq.errors'

export const getMainParamHandler = (
  modelName: string,
  handlerAccesses: HandlerAccessEnum[] = []
) => {
  const getById: RouteHandlerMethod = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.GET_BY_ID))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL)

    const Model = model(req, modelName)

    const { id } = req.params as { id: string }

    const query = getQuery(req.query)

    const doc = await Model.findById(id, query.select, { req })
      .and(query.filter)
      .populate(query.populate)
      .lean(leanOptions)

    if (!doc) throw httpErrors.notFound(DOCUMENT_NOT_FOUND)

    runStaticMethods({ Model, docs: [doc], query, req })

    return doc
  }

  // ---

  const updateById: RouteHandlerMethod = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.UPDATE_BY_ID))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL)

    const Model = model(req, modelName)

    const { id } = req.params as { id: string }

    const doc = await Model.findById(id)

    if (!doc) throw httpErrors.notFound(DOCUMENT_NOT_FOUND)

    const _prev = doc.toJSON(toJSONOptions)

    const bodyFlat: any = flatten(req.body)

    Object.entries(bodyFlat).forEach(([k, v]) => k !== '_id' && doc.set(k, v))

    await useSession(
      Model,
      req,
      // @ts-ignore: custom arg req
      (session: ClientSession) => doc.save({ req, session, _prev })
    )

    return doc.toJSON(toJSONOptions)
  }

  return {
    getById,
    updateById,
  }
}
