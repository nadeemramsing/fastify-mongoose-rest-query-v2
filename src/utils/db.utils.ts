import { FastifyInstance, FastifyRequest } from 'fastify'
import { httpErrors } from '@fastify/sensible'
import { Connection, createConnection, IndexesDiff } from 'mongoose'
import fp from 'lodash/fp'
import promiseAll from 'promise-all'
import { IRestOptions } from '../mrq.interfaces'
import { SCHEMA_NOT_REGISTERED } from '../mrq.errors'
import { store } from '../mrq.config'

const pool: { [key: string]: Connection } = {}

let singleConnection: Connection | null = null

export async function getSingleConnection(
  app: FastifyInstance,
  opts: IRestOptions
) {
  if (!store.mongoPath) return
  singleConnection = await getDB(app, store.mongoPath, opts.schemas)
}

export async function getDB(
  app: FastifyInstance,
  uri: string,
  schemas: IRestOptions['schemas']
) {
  if (singleConnection) return singleConnection

  let conn: Connection = pool[uri]

  if (!conn) {
    conn = createConnection(uri, {
      autoIndex: false,
      auth: {
        username: store.mongoUser,
        password: store.mongoPassword,
      },
    })

    await conn.asPromise()

    pool[uri] = conn

    await mapModels(app, conn, schemas)
  }

  return conn
}

async function mapModels(
  app: FastifyInstance,
  conn: Connection,
  schemas: IRestOptions['schemas']
) {
  const p: { [modelName: string]: Promise<IndexesDiff> } = {}

  conn.securePathsPerModel = {}

  for (const modelName in schemas) {
    const { schema } = schemas[modelName]

    if (modelName in conn.models) continue

    const Model = conn.model(modelName, schema)

    p[modelName] = Model.diffIndexes()

    schema.eachPath((path, schemaType) => {
      if (!conn.securePathsPerModel[modelName])
        conn.securePathsPerModel[modelName] = {}

      if (schemaType.options.secure)
        conn.securePathsPerModel[modelName][path] = true
    })
  }

  const diffs = await promiseAll(p).then(
    fp.pickBy<IndexesDiff>((v, k) => v.toDrop.length || v.toCreate.length)
  )

  const hasAnyDiff = Object.keys(diffs).length

  if (hasAnyDiff)
    app.log.info('Result of diffIndexes:', JSON.stringify(diffs, null, 2))
}

export async function closeConnections() {
  const p = []

  for (const uri in pool) p.push(pool[uri].close())

  await Promise.allSettled(p)
}

export function model(req: FastifyRequest, modelName: string) {
  const Model = req.mongooseConn.models[modelName]

  if (!Model) throw httpErrors.badRequest(SCHEMA_NOT_REGISTERED)

  return Model
}
