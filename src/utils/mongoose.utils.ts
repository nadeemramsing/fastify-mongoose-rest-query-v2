import { ClientSession, Model } from 'mongoose'
import { FastifyRequest } from 'fastify'
import { httpErrors } from '@fastify/sensible'
import {
  DOCUMENT_NOT_FOUND,
  EMPTY_BODY,
  INVALID_BODY,
  SUBARRAY_NOT_FOUND,
} from '../mrq.errors'
import { model } from './db.utils'
import { leanOptions } from '../mrq.config'
import { MrqDocument } from '../mrq.interfaces'

interface IRunStaticMethods<T> {
  Model: Model<T>
  docs: any[]
  query: { select: { [key: string]: number } }
  req: FastifyRequest
}

// ---

export function runStaticMethods<T>({
  Model,
  docs,
  query,
  req,
}: IRunStaticMethods<T>) {
  for (const staticMethodName in Model.schema.statics) {
    if (query.select[staticMethodName] !== 1) continue

    for (const doc of docs)
      doc[staticMethodName] = Model.schema.statics[staticMethodName].call(
        Model,
        doc,
        { req, query }
      )
  }
}

// ---

export async function useSession(
  Model: Model<any>,
  req: FastifyRequest,
  cb: (session?: ClientSession) => any
) {
  const query = req.query as { useSession: string }
  const shouldUseSession = query.useSession === 'true'

  if (!shouldUseSession) return cb()

  const session = await Model.startSession()
  const res = await cb(session)
  session.endSession()

  return res
}

// ---

export function getArrayFromBodyWithId(body: any[]) {
  if (!Array.isArray(body))
    throw httpErrors.unprocessableEntity(
      `${INVALID_BODY}: body should be an array`
    )

  if (!body.length)
    throw httpErrors.unprocessableEntity(
      `${EMPTY_BODY}: body should contain at least one object`
    )

  body = body.filter((doc) => doc._id)

  if (!body.length)
    throw httpErrors.unprocessableEntity(
      `${INVALID_BODY}: body should contain at least one object with _id`
    )

  return body
}

// ---

export async function getSubarray(
  req: FastifyRequest,
  modelName: string,
  subPathName: string,
  useLean: boolean = false
): Promise<{ Model: Model<any>; doc: MrqDocument; subarray: any }> {
  const Model = model(req, modelName)

  const { id } = req.params as { id: string }

  const p = Model.findById(id, {}, { req }).select(subPathName)

  const doc: MrqDocument = await (useLean ? p.lean(leanOptions) : p)

  if (!doc) throw httpErrors.notFound(DOCUMENT_NOT_FOUND)

  if (!doc[subPathName]) throw httpErrors.notFound(SUBARRAY_NOT_FOUND)

  return {
    Model,
    doc,
    subarray: doc[subPathName],
  }
}
