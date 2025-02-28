import { RouteHandlerMethod } from 'fastify'
import { httpErrors } from '@fastify/sensible'
import { ClientSession, Document } from 'mongoose'
import { model } from '../utils/db.utils'
import { leanOptions, toJSONOptions } from '../mrq.config'
import { getQuery } from '../utils/query.utils'
import { HandlerAccessEnum } from '../mrq.enum'
import * as subService from '../services/sub.service'
import { getQueryForSubarray } from '../utils/query.sub.utils'
import {
  getArrayFromBodyWithId,
  getSubarray,
  runStaticMethods,
  useSession,
} from '../utils/mongoose.utils'
import {
  DOCUMENT_NOT_FOUND,
  IMPLICIT_DELETE_ALL_NOT_ALLOWED,
  INVALID_BODY,
  NO_DOCUMENT_FOUND,
  PATH_NOT_FOUND_IN_SCHEMA,
  ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL,
} from '../mrq.errors'

export const getMainParamSubarrayHandler = (
  modelName: string,
  subPathName: string,
  handlerAccesses: HandlerAccessEnum[] = []
) => {
  const getByQuery: RouteHandlerMethod = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.GET_BY_ID_SUB))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL)

    const { subarray } = await getSubarray(req, modelName, subPathName, true)

    const query = getQueryForSubarray(req.query)

    return subService.getByQuery({ query, subarray })
  }

  // ---

  const count: RouteHandlerMethod = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.COUNT_SUB))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL)

    const { subarray } = await getSubarray(req, modelName, subPathName, true)

    const query = getQueryForSubarray(req.query, { ignoreSelect: true })

    return subService.count({ query, subarray })
  }

  // ---

  return {
    getByQuery,
    count,
  }
}
