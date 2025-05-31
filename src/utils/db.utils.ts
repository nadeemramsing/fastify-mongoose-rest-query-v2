import { FastifyInstance, FastifyRequest } from 'fastify'
import { httpErrors } from '@fastify/sensible'
import { Connection, createConnection, IndexesDiff } from 'mongoose'
import fp from 'lodash/fp'
import promiseAll from 'promise-all'
import { IModelToSchemaMap } from '../mrq.interfaces'
import { SCHEMA_NOT_REGISTERED } from '../mrq.errors'
import { store } from '../mrq.config'

let connGlobal: Connection

export async function initConnection() {
  const mongoUrl = `${store.mongoBaseUrl}/${store.mongoDatabaseName ?? ''}`

  connGlobal = await createConnection(mongoUrl, {
    autoIndex: false,
    auth: {
      username: store.mongoUser,
      password: store.mongoPassword,
    },
    authSource: store.mongoAdminSource,
    minPoolSize: store.mongoMinPoolSize,
    maxPoolSize: store.mongoMaxPoolSize,
    replicaSet: store.mongoReplicaSet || undefined,
  }).asPromise()
}

export async function getDB(
  app: FastifyInstance,
  databaseName: string,
  schemas: IModelToSchemaMap
) {
  let connDB: Connection

  if (store.mongoDatabaseName) connDB = connGlobal
  else
    connDB = await connGlobal
      .useDb(databaseName, { useCache: true })
      .asPromise()

  if (!connDB.get('hasMapModelsBeenCalled'))
    await mapModels(app, connDB, schemas)

  return connDB
}

async function mapModels(
  app: FastifyInstance,
  connDB: Connection,
  schemas: IModelToSchemaMap
) {
  connDB.set('hasMapModelsBeenCalled', true)

  const p: { [modelName: string]: Promise<IndexesDiff> } = {}

  connDB.securePathsPerModel = {}

  for (const modelName in schemas) {
    const schema = schemas[modelName]

    if (modelName in connDB.models) continue

    const Model = connDB.model(modelName, schema)

    p[modelName] = Model.diffIndexes()

    schema.eachPath((path, schemaType) => {
      if (!connDB.securePathsPerModel[modelName])
        connDB.securePathsPerModel[modelName] = {}

      if (schemaType.options.secure)
        connDB.securePathsPerModel[modelName][path] = true
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
  await connGlobal.close()
}

export function model(req: FastifyRequest, modelName: string) {
  const Model = req.mongooseConn.models[modelName]

  if (!Model) throw httpErrors.badRequest(SCHEMA_NOT_REGISTERED)

  return Model
}
