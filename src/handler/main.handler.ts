import { RouteHandlerMethod } from 'fastify'
import { httpErrors } from '@fastify/sensible'
import { ClientSession, Document } from 'mongoose'
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

export const getMainHandler = (
  modelName: string,
  handlerAccesses: HandlerAccessEnum[] = []
) => {
  const getByQuery: RouteHandlerMethod = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.GET_BY_QUERY))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL)

    const Model = model(req, modelName)

    const query = getQuery(req, modelName)

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

    const query = getQuery(req, modelName, { ignoreSelect: true })

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

    const query = getQuery(req, modelName, { ignoreSelect: true })

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
      throw httpErrors.notFound(`${INVALID_BODY}: no object found in array`)

    if (!isBodyAnArray) body = [body]

    const docs = await useSession(Model, req, (session?: ClientSession) =>
      Model.create(body, { req, session, ordered: !!session })
    )

    const result = docs.map((doc: any) => doc.toJSON(toJSONOptions))

    return isBodyAnArray ? result : result[0]
  }

  // ---

  const updateMany: RouteHandlerMethod = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.UPDATE_MANY))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL)

    const Model = model(req, modelName)

    const body = getArrayFromBodyWithId(req.body as any[])

    const _id = { $in: body.map((item: any) => item._id) }

    const docs: Record<string, Document> = await Model.find({ _id }).then(
      (docs) => docs.reduce((acc, v: any) => ({ ...acc, [v._id]: v }), {})
    )

    //@ts-ignore
    req.query.useSession = 'true'

    const docsSaved: Document[] = []

    const isOverwrite = req.routeOptions.url?.endsWith?.('/overwrite')

    await useSession(Model, req, async (session?: ClientSession) => {
      for (const item of body) {
        const doc = docs[item._id]

        const _prev = doc.toJSON(toJSONOptions)

        isOverwrite ? doc.overwrite(item) : doc.set(item)

        // @ts-ignore: custom arg req
        docsSaved.push(await doc.save({ req, session, _prev }))
      }
    })

    return docsSaved
  }

  // ---

  const deleteByQuery: RouteHandlerMethod = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.DELETE_BY_QUERY))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL)

    const Model = model(req, modelName)

    const query = getQuery(req, modelName, { ignoreSelect: true })

    const isDeleteAll = !Object.keys(query.filter).length

    if (isDeleteAll)
      throw httpErrors.methodNotAllowed(
        `${IMPLICIT_DELETE_ALL_NOT_ALLOWED}: delete directly in database`
      )

    const { deletedCount } = await useSession(
      Model,
      req,
      (session?: ClientSession) => Model.deleteMany(query.filter, { session })
    )

    if (!deletedCount) throw httpErrors.notFound(NO_DOCUMENT_FOUND)

    return { deletedCount }
  }

  // ---

  const getById: RouteHandlerMethod = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.GET_BY_ID))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL)

    const Model = model(req, modelName)

    const { id } = req.params as { id: string }

    const query = getQuery(req, modelName)

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
    getByQuery,
    count,
    distinct,
    create,
    updateMany,
    deleteByQuery,

    getById,
    updateById,
    deleteById,
  }
}
