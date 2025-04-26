import memoize from 'moize'
import { FastifyRequest } from 'fastify'
import { httpErrors } from '@fastify/sensible'
import { parseFilter, parseSort, parseProject } from 'mongodb-query-parser'
import { IMPLICIT_SELECT_ALL_NOT_ALLOWED } from '../mrq.errors'
import { IGetQueryOptions, MrqQuery } from '../mrq.interfaces'
import { memoOptions } from '../mrq.config'

type TypeSecurePaths = { [path: string]: boolean }

export function getQuery(
  req: FastifyRequest,
  modelName: string,
  options: IGetQueryOptions = {}
) {
  const securePaths = req.mongoose_conn.securePathsPerModel[modelName]

  return getQueryInternal(req.query, securePaths, options)
}

const getQueryInternal = memoize(getQueryInternal_, memoOptions)

function getQueryInternal_(
  query: any,
  securePaths: TypeSecurePaths,
  options: IGetQueryOptions = {}
): MrqQuery {
  const filter = getFilter(query.filter)

  const sort = getSort(query.sort)

  const select = getSelect(query.select, securePaths, options)

  const populate = getPopulate(query.populate)

  const skip = query.skip ? parseInt(query.skip) : 0

  const limit = query.limit ? parseInt(query.limit) : 0

  return {
    filter,
    sort,
    select,
    populate,
    skip,
    limit,
  }
}

function getFilter(filter: string) {
  const filterStr = typeof filter !== 'string' ? JSON.stringify(filter) : filter

  return parseFilter(filterStr) ?? {}
}

export function getSort(fields: string) {
  if (!fields) return {}

  const sort: Record<string, 1 | -1> = {}

  const fieldList = fields.split(',').map((str) => str.trim())

  for (const field of fieldList) {
    if (field.startsWith('-')) sort[field.slice(1)] = -1
    else sort[field] = 1
  }

  return parseSort(JSON.stringify(sort))
}

export function getSelect(
  fields: string = '',
  securePaths: TypeSecurePaths = {},
  options: IGetQueryOptions = {}
) {
  if (options.ignoreSelect) return {}

  const select: Record<string, 1 | 0> = {}

  const fieldList = fields
    .split(',')
    .map((str) => str.trim())
    .filter(Boolean)

  if (!fieldList.length)
    throw httpErrors.methodNotAllowed(
      `${IMPLICIT_SELECT_ALL_NOT_ALLOWED}: use select=all query param`
    )

  if (fieldList.includes('all'))
    return transformSecurePathsToSelect(securePaths)

  for (const field of fieldList) {
    if (securePaths[field]) continue

    if (field.startsWith('-')) select[field.slice(1)] = 0
    else select[field] = 1
  }

  return parseProject(JSON.stringify(select))
}

function transformSecurePathsToSelect(securePaths: TypeSecurePaths) {
  const select: Record<string, 1 | 0> = {}

  for (const [path, value] of Object.entries(securePaths)) {
    if (value) select[path] = 0
  }

  return select
}

function getPopulate(populate: string): any {
  return parsePopulate(populate)
}

function parsePopulate(populate: string) {
  try {
    const parsed = JSON.parse(populate)

    if (typeof parsed !== 'object') throw 1

    // Sanitize normally is being done in parseFilter
    return parseFilter(JSON.stringify(parsed))
  } catch (e) {
    return populate
  }
}
