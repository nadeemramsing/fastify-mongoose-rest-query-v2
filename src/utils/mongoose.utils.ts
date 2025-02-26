import { Model } from 'mongoose'
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
