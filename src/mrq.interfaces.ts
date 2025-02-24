import { Schema } from 'mongoose'

export interface ISchemaOption {
  endpointName: string
  schema: Schema
}

export interface IRestOptions {
  prefix: string
  schemas: {
    [modelName: string]: ISchemaOption
  }
}

export interface IGetQueryOptions {
  ignoreSelect?: boolean
}
