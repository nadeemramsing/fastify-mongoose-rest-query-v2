import { ObjectId } from 'bson'
import { Model, Types } from 'mongoose'
import { FastifyRequest } from 'fastify'
import {
  drop,
  filter,
  isNil,
  map,
  orderBy,
  partition,
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
import { toJSONOptions, toObjectOptions } from '../mrq.config'
import { useSession } from '../utils/mongoose.utils'
import { httpErrors } from '@fastify/sensible'
import {
  IMPLICIT_DELETE_ALL_NOT_ALLOWED,
  NO_SUBITEM_FOUND,
} from '@src/mrq.errors'

interface IBaseOptions {
  body: any
  doc: MrqDocument
  query: Omit<MrqQuery, 'populate'>
  Model: Model<any>
  path: string
  req: FastifyRequest
  subarray: any[] | Types.DocumentArray<any>
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

// ---

export async function updateMany({
  body,
  doc,
  Model,
  req,
  subarray,
}: Pick<IBaseOptions, 'body' | 'doc' | 'Model' | 'req' | 'subarray'> & {
  subarray: Types.DocumentArray<any>
}) {
  const _prev = doc.toJSON(toJSONOptions)

  const bodyIdsMap = body.reduce(
    (acc: {}, v: any) => ({ ...acc, [v._id]: true }),
    {}
  )

  const [subitemsToUpdate, subitemsToNotUpdate] = partition(
    (subitem) => bodyIdsMap[subitem._id],
    subarray
  )

  for (const item of body) {
    const subitem: Types.Subdocument = subarray.id(item._id)

    if (!subitem) continue

    subitem.set(item)
  }

  if (req.routeOptions.url?.endsWith?.('/overwrite'))
    for (const subitem of subitemsToNotUpdate) subitem.deleteOne()

  await useSession(
    Model,
    req,
    // @ts-ignore: custom arg req
    (session?: ClientSession) => doc.save({ req, session, _prev })
  )

  const query = req.query as { returnAll: string }
  const shouldReturnAll = query.returnAll === 'true'

  return shouldReturnAll
    ? subarray.map((subitem) => subitem.toJSON(toJSONOptions))
    : subitemsToUpdate.map((subitem) => subitem.toJSON(toJSONOptions))
}

// ---

export async function deleteByQuery({
  doc,
  query,
  Model,
  req,
  subarray,
}: Pick<IBaseOptions, 'doc' | 'query' | 'Model' | 'req' | 'subarray'> & {
  subarray: Types.DocumentArray<Types.Subdocument>
}) {
  const isDeleteAll = !Object.keys(query.filter).length

  if (isDeleteAll)
    throw httpErrors.methodNotAllowed(IMPLICIT_DELETE_ALL_NOT_ALLOWED)

  const subarrayToDelete = filter(
    sift(query.filter),
    subarray
  ) as Types.DocumentArray<Types.Subdocument>

  if (subarrayToDelete.length === 0) throw httpErrors.notFound(NO_SUBITEM_FOUND)

  const _prev = doc.toJSON(toJSONOptions)

  for (const subitem of subarrayToDelete) subitem.deleteOne()

  await useSession(
    Model,
    req,
    // @ts-ignore: custom arg req
    (session?: ClientSession) => doc.save({ req, session, _prev })
  )

  return subarray.map((subitem) => subitem.toJSON(toJSONOptions))
}
