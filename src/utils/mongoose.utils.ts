import { ClientSession, Model } from 'mongoose'
import { FastifyRequest } from 'fastify'
import { httpErrors } from '@fastify/sensible'
import {
  DOCUMENT_NOT_FOUND,
  EMPTY_BODY,
  INVALID_BODY,
  SUBARRAY_NOT_FOUND,
  SUBITEM_NOT_FOUND,
} from '../mrq.errors'
import { model } from './db.utils'
import { leanOptions } from '../mrq.config'
import { MrqDocument } from '../mrq.interfaces'
import fp from 'lodash/fp'

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
  subPathName_: string,
  useLean: boolean = false
): Promise<{ Model: Model<any>; doc: MrqDocument; subarray: any }> {
  const Model = model(req, modelName)

  const { id } = req.params as { id: string }

  const [subPathName] = subPathName_.split(':')

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

// ---

export async function getChildarray(
  req: FastifyRequest,
  modelName: string,
  fullPathName: string,
  useLean: boolean = false
) {
  const Model = model(req, modelName)

  const { id, subId } = req.params as { id: string; subId: string }

  const [subPathName, childPathName] = fullPathName.split(':')

  const p = Model.find(
    {
      _id: id,
      [`${subPathName}._id`]: subId,
    },
    {},
    { req }
  ).select(`
      ${subPathName}._id
      ${subPathName}.${childPathName}
    `)

  const [doc]: any[] = (await (useLean ? p.lean(leanOptions) : p)) ?? []

  if (!doc) throw httpErrors.notFound(DOCUMENT_NOT_FOUND)

  const subitem = fp.find((subitem) => subitem._id.equals(subId), doc[subPathName])

  if (!subitem) throw httpErrors.notFound(SUBITEM_NOT_FOUND)

  return {
    Model,
    doc,
    subitem,
    subarray: subitem[childPathName],
  }
}
