import { ClientSession, Model } from 'mongoose'
import { FastifyRequest } from 'fastify'

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
  shouldUseSession: boolean = false,
  cb: (session?: ClientSession) => any
) {
  if (!shouldUseSession) return cb()

  const session = await Model.startSession()
  const res = await cb(session)
  session.endSession()

  return res
}
