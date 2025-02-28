import { RouteHandlerMethod } from 'fastify'
import { httpErrors } from '@fastify/sensible'
import { ClientSession } from 'mongoose'
import { model } from '../utils/db.utils'
import { leanOptions, toJSONOptions } from '../mrq.config'
import { getQuery } from '../utils/query.utils'
import { HandlerAccessEnum } from '../mrq.enum'
import { runStaticMethods, useSession } from '../utils/mongoose.utils'
import {
  DOCUMENT_NOT_FOUND,
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

    req.routeOptions.url?.endsWith?.('/overwrite')
      ? doc.overwrite(req.body)
      : doc.set(req.body)

    await useSession(
      Model,
      req,
      // @ts-ignore: custom arg req
      (session: ClientSession) => doc.save({ req, session, _prev })
    )

    return doc.toJSON(toJSONOptions)
  }

  // ---

  const deleteById: RouteHandlerMethod = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.DELETE_BY_ID))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL)

    const Model = model(req, modelName)

    const { id: _id } = req.params as { id: string }

    const { deletedCount } = await useSession(
      Model,
      req,
      (session?: ClientSession) => Model.deleteOne({ _id }, { session })
    )

    if (!deletedCount) throw httpErrors.notFound(DOCUMENT_NOT_FOUND)

    return { deletedCount }
  }

  return {
    getById,
    updateById,
    deleteById,
  }
}
