import { Schema, Document } from 'mongoose'
import { HandlerAccessEnum } from './mrq.enum'

export interface ISchemaOption {
  endpointName: string
  schema: Schema
  handlerAccesses: HandlerAccessEnum[]
}

export interface ISchemaOptionSub {
  endpointName: string
  schema: Schema
  handlerAccesses: HandlerAccessEnum[]
  getSubarray: Function
  subIdName: string
  subPathName: string
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

export interface MrqDocument extends Document {
  [key: string]: any
}

export interface MrqQuery {
  filter: any
  sort: any
  select: any
  populate: any
  skip: number
  limit: number
}
