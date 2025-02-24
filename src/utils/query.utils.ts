import memoize from 'nano-memoize'
import { httpErrors } from '@fastify/sensible'
import { parse } from '@mongodb-js/shell-bson-parser'
import { IMPLICIT_SELECT_ALL_NOT_ALLOWED } from '../mrq.errors'
import { IGetQueryOptions } from '../mrq.interfaces'
import { memoOptions } from '../mrq.config'

export const getQuery = memoize(getQuery_, memoOptions)

function getQuery_(query: any, options: IGetQueryOptions = {}) {
  const filterStr =
    typeof query.filter !== 'string'
      ? JSON.stringify(query.filter)
      : query.filter

  const filter = parse(filterStr) ?? {}

  const sort = getSort(query.sort)

  const select = getSelect(query.select, options)

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

export function getSort(fields: string) {
  if (!fields) return {}

  const sort: Record<string, 1 | -1> = {}

  const fieldList = fields.split(',').map((str) => str.trim())

  for (const field of fieldList) {
    if (field.startsWith('-')) sort[field.slice(1)] = -1
    else sort[field] = 1
  }

  return sort
}

export function getSelect(fields: string = '', options: IGetQueryOptions = {}) {
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

  if (fieldList.includes('all')) return {}

  // What happens to controllers not using query.select but query.filter only for example count

  for (const field of fieldList) {
    if (field.startsWith('-')) select[field.slice(1)] = 0
    else select[field] = 1
  }

  return select
}

function getPopulate(fields: string) {
  if (!fields) return ''

  if (typeof fields === 'string')
    return fields.replaceAll(' ', '').replaceAll(',', ' ')

  return fields
}
