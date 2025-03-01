import { ObjectId } from 'bson'
import { Model } from 'mongoose'
import { FastifyRequest } from 'fastify'
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
import { MrqDocument, MrqQuery } from '../mrq.interfaces'
import { toJSONOptions } from '../mrq.config'
import { useSession } from '../utils/mongoose.utils'

interface IBaseOptions {
  body: any
  doc: MrqDocument
  query: Omit<MrqQuery, 'populate'>
  Model: Model<any>
  path: string
  req: FastifyRequest
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

export async function create({
  body,
  doc,
  Model,
  req,
  subarray,
}: Pick<IBaseOptions, 'body' | 'doc' | 'Model' | 'req' | 'subarray'>) {
  const _prev = doc.toJSON(toJSONOptions)

  const idsMap = body
    .map((item: any) => ((item._id = item._id ?? new ObjectId()), item))
    .reduce((acc: {}, v: any) => ({ ...acc, [v._id]: true }), {})

  for (const item of body) subarray.push(item)

  await useSession(
    Model,
    req,
    // @ts-ignore: custom arg req
    (session?: ClientSession) => doc.save({ req, session, _prev })
  )

  const subarraySaved = subarray.map((subitem) => subitem.toJSON(toJSONOptions))

  const query = req.query as { returnAll: string }
  const shouldReturnAll = query.returnAll === 'true'

  if (shouldReturnAll) return subarraySaved

  return subarraySaved.filter((subitem) => idsMap[subitem._id])
}
