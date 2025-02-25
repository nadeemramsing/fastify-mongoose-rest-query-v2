import { Schema } from 'mongoose'
import { HandlerAccessEnum } from './mrq.enum'

export interface ISchemaOption {
  endpointName: string
  schema: Schema
  handlerAccesses?: HandlerAccessEnum[]
}

export interface IRestOptions {
  role?: string
  schemas: {
    [modelName: string]: ISchemaOption
  }
}

export interface IGetQueryOptions {
  ignoreSelect?: boolean
}
