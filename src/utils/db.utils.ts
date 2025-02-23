import { IRestOptions } from '@src/mrq.interfaces'
import { Connection, createConnection, IndexesDiff } from 'mongoose'
import { pickBy } from 'lodash/fp'
import promiseAll from 'promise-all'

const pool: { [key: string]: Connection } = {}

export async function getDB(uri: string, schemas: IRestOptions['schemas']) {
  let conn: Connection = pool[uri]

  if (!conn) {
    conn = createConnection(uri, { autoIndex: false })

    pool[uri] = conn

    await conn.asPromise()

    await mapModels(conn, schemas)
  }

  return conn
}

async function mapModels(conn: Connection, schemas: IRestOptions['schemas']) {
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
    console.info('Result of diffIndexes:', JSON.stringify(diffs, null, 2))
}
