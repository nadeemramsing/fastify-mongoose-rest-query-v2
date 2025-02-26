import { ClientSession, Model } from 'mongoose'
import { FastifyRequest } from 'fastify'
import { httpErrors } from '@fastify/sensible'

interface IRunStaticMethods<T> {
  Model: Model<T>
  docs: any[]
  query: { select: { [key: string]: number } }
  req: FastifyRequest
}

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

export function getArrayFromBodyWithId(body: any[]) {
  if (!Array.isArray(body))
    throw httpErrors.unprocessableEntity(
      'invalid_body: body should be an array'
    )

  if (!body.length)
    throw httpErrors.unprocessableEntity(
      'empty_body: body should contain at least one object'
    )

  body = body.filter((doc) => doc._id)

  if (!body.length)
    throw httpErrors.unprocessableEntity(
      'invalid_body: body should contain at least one object with _id'
    )

  return body
}
