import { ObjectId } from 'bson'
import { Model, Types } from 'mongoose'
import { FastifyRequest } from 'fastify'
import fp from 'lodash/fp'
import sift from 'sift'
import { MrqDocument, MrqQuery } from '../mrq.interfaces'
import { toJSONOptions } from '../mrq.config'
import { useSession } from '../utils/mongoose.utils'
import { httpErrors } from '@fastify/sensible'
import {
  IMPLICIT_DELETE_ALL_NOT_ALLOWED,
  NO_SUBITEM_FOUND,
  SUBITEM_NOT_FOUND,
} from '../mrq.errors'

interface IBaseOptions {
  body: any
  doc: MrqDocument
  query: Omit<MrqQuery, 'populate'>
  Model: Model<any>
  path: string
  req: FastifyRequest
  subarray: any[] | Types.DocumentArray<Types.Subdocument>
  subId: string
}

export async function getByQuery({
  query,
  subarray,
}: Pick<IBaseOptions, 'query' | 'subarray'>) {
  return fp.pipe(
    fp.filter(sift(query.filter)),
    query.sort.sortFieldsArr.length
      ? fp.orderBy(query.sort.sortFieldsArr, query.sort.sortOrderArr)
      : (x) => x,
    fp.drop(query.skip),
    fp.take(query.limit),
    fp.map(query.select.length > 1 ? fp.pick(query.select) : (x) => x)
  )(subarray)
}

// ---

export async function count({
  query,
  subarray,
}: Pick<IBaseOptions, 'query' | 'subarray'>) {
  return fp.pipe(fp.filter(sift(query.filter)), fp.size)(subarray)
}

// ---

export async function distinct({
  query,
  path,
  subarray,
}: Pick<IBaseOptions, 'query' | 'path' | 'subarray'>) {
  return fp.pipe(
    fp.filter(sift(query.filter)),
    fp.pluck(path),
    fp.uniq,
    fp.reject(fp.isNil)
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
  subarray: Types.DocumentArray<Types.Subdocument>
}) {
  const _prev = doc.toJSON(toJSONOptions)

  const bodyIdsMap = body.reduce(
    (acc: {}, v: any) => ({ ...acc, [v._id]: true }),
    {}
  )

  const [subitemsToUpdate, subitemsToNotUpdate] = fp.partition(
    (subitem) => bodyIdsMap[subitem._id],
    subarray
  )

  for (const item of body) {
    const subitem = subarray.id(item._id)

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

  const subarrayToDelete = fp.filter(
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

// ---

export async function getById({
  query,
  subarray,
  subId,
}: Pick<IBaseOptions, 'query' | 'subarray' | 'subId'>) {
  const subitem = fp.pipe(
    fp.find((subitem: { _id: ObjectId }) => subitem._id.equals(subId)),
    query.select.length > 1 ? fp.pick(query.select) : (x) => x
  )(subarray)

  if (!subitem || !Object.keys(subitem).length)
    throw httpErrors.notFound(SUBITEM_NOT_FOUND)

  return subitem
}

// ---

export async function updateById({
  body,
  doc,
  Model,
  req,
  subarray,
  subId,
}: Pick<
  IBaseOptions,
  'body' | 'doc' | 'Model' | 'req' | 'subarray' | 'subId'
> & {
  subarray: Types.DocumentArray<Types.Subdocument>
}) {
  const _prev = doc.toJSON(toJSONOptions)

  const subitem = subarray.id(subId)

  if (!subitem) throw httpErrors.notFound(SUBITEM_NOT_FOUND)

  if (req.routeOptions.url?.endsWith?.('/overwrite')) subitem.overwrite(body)
  else subitem.set(body)

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
    : subitem.toJSON(toJSONOptions)
}

// ---

export async function deleteById({
  doc,
  Model,
  req,
  subarray,
  subId,
}: Pick<IBaseOptions, 'doc' | 'Model' | 'req' | 'subarray' | 'subId'> & {
  subarray: Types.DocumentArray<Types.Subdocument>
}) {
  const _prev = doc.toJSON(toJSONOptions)

  const subitem = subarray.id(subId)

  if (!subitem) throw httpErrors.notFound(SUBITEM_NOT_FOUND)

  subitem.deleteOne()

  await useSession(
    Model,
    req,
    // @ts-ignore: custom arg req
    (session?: ClientSession) => doc.save({ req, session, _prev })
  )

  return subarray.map((subitem) => subitem.toJSON(toJSONOptions))
}
