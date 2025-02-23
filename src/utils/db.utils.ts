import { FastifyInstance } from 'fastify'
import { Connection, createConnection, IndexesDiff } from 'mongoose'
import { pickBy } from 'lodash/fp'
import promiseAll from 'promise-all'
import { IRestOptions } from '../mrq.interfaces'

const pool: { [key: string]: Connection } = {}

export async function getDB(
  app: FastifyInstance,
  uri: string,
  schemas: IRestOptions['schemas']
) {
  let conn: Connection = pool[uri]

  if (!conn) {
    conn = createConnection(uri, { autoIndex: false })

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

  for (const modelName in schemas) {
    const { schema } = schemas[modelName]

    if (modelName in conn.models) continue

    const Model = conn.model(modelName, schema)

    p[modelName] = Model.diffIndexes()
  }

  const diffs = await promiseAll(p).then(
    pickBy<IndexesDiff>((v, k) => v.toDrop.length || v.toCreate.length)
  )

  const hasAnyDiff = Object.keys(diffs).length

  if (hasAnyDiff)
    app.log.info('Result of diffIndexes:', JSON.stringify(diffs, null, 2))
}

export async function closeConnections() {
  // Test failing due to this right now
  // for (const uri in pool) await pool[uri].close()
}
