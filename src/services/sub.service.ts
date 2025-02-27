import { Model } from 'mongoose'
import { FastifyRequest } from 'fastify'
import { MrqDocument, MrqQuery } from '../mrq.interfaces'
import {
  drop,
  filter,
  isNil,
  map,
  orderBy,
  pick,
  pipe,
  pluck,
  reject,
  size,
  take,
  uniq,
} from 'lodash/fp'
import sift from 'sift'

interface IBaseOptions {
  body: any
  doc: MrqDocument
  query: Omit<MrqQuery, 'populate'>
  Model: Model<any>
  path: string
  req: FastifyRequest
  shouldForceDelete: boolean
  shouldReturnAll: boolean
  shouldUseSession: boolean
  subarray: any[]
  subId: string
}

export async function getByQuery({
  query,
  subarray,
}: Pick<IBaseOptions, 'query' | 'subarray'>) {
  return pipe(
    filter(sift(query.filter)),
    query.sort.sortFieldsArr.length
      ? orderBy(query.sort.sortFieldsArr, query.sort.sortOrderArr)
      : (x) => x,
    drop(query.skip),
    take(query.limit),
    map(query.select.length > 1 ? pick(query.select) : (x) => x)
  )(subarray)
}

// ---

export async function count({
  query,
  subarray,
}: Pick<IBaseOptions, 'query' | 'subarray'>) {
  return pipe(filter(sift(query.filter)), size)(subarray)
}

// ---

export async function distinct({
  query,
  path,
  subarray,
}: Pick<IBaseOptions, 'query' | 'path' | 'subarray'>) {
  return pipe(
    filter(sift(query.filter)),
    pluck(path),
    uniq,
    reject(isNil)
  )(subarray)
}

// ---
