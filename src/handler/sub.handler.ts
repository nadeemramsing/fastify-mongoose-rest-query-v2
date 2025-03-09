import { RouteHandlerMethod } from 'fastify'
import { httpErrors } from '@fastify/sensible'
import { HandlerAccessEnum } from '../mrq.enum'
import * as subService from '../services/sub.service'
import { getQueryForSubarray } from '../utils/query.sub.utils'
import { ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL } from '../mrq.errors'

export const getSubHandler = (
  modelName: string,
  subPathName: string,
  handlerAccesses: HandlerAccessEnum[] = [],
  getSubarray: Function,
  subIdName: string
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

  const distinct: RouteHandlerMethod = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.DISTINCT_SUB))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL)

    const { subarray } = await getSubarray(req, modelName, subPathName, true)

    const query = getQueryForSubarray(req.query, { ignoreSelect: true })

    const { path } = req.params as { path: string }

    return subService.distinct({ query, path, subarray })
  }

  // ---

  const create: RouteHandlerMethod = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.CREATE_SUB))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL)

    const { Model, doc, subarray } = await getSubarray(
      req,
      modelName,
      subPathName
    )

    return subService.create({
      body: req.body,
      doc,
      Model,
      req,
      subarray,
    })
  }

  // ---

  const updateMany: RouteHandlerMethod = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.UPDATE_MANY_SUB))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL)

    const { Model, doc, subarray } = await getSubarray(
      req,
      modelName,
      subPathName
    )

    return subService.updateMany({
      body: req.body,
      doc,
      Model,
      req,
      subarray,
    })
  }

  // ---

  const deleteByQuery: RouteHandlerMethod = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.DELETE_BY_QUERY_SUB))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL)

    const { Model, doc, subarray } = await getSubarray(
      req,
      modelName,
      subPathName
    )

    const query = getQueryForSubarray(req.query, { ignoreSelect: true })

    return subService.deleteByQuery({ doc, Model, req, subarray, query })
  }

  // ---

  const getById: RouteHandlerMethod = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.GET_BY_ID_SUB))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL)

    const { subarray } = await getSubarray(req, modelName, subPathName)

    const params = req.params as { [key: string]: string }

    const query = getQueryForSubarray(req.query)

    return subService.getById({ query, subarray, subId: params[subIdName] })
  }

  // ---

  const updateById: RouteHandlerMethod = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.UPDATE_BY_ID_SUB))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL)

    const { Model, doc, subarray } = await getSubarray(
      req,
      modelName,
      subPathName
    )

    const params = req.params as { [key: string]: string }

    return subService.updateById({
      body: req.body,
      subId: params[subIdName],
      doc,
      Model,
      req,
      subarray,
    })
  }

  // ---

  const deleteById: RouteHandlerMethod = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.DELETE_BY_ID_SUB))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL)

    const { Model, doc, subarray } = await getSubarray(
      req,
      modelName,
      subPathName
    )

    const params = req.params as { [key: string]: string }

    return subService.deleteById({
      doc,
      Model,
      req,
      subarray,
      subId: params[subIdName],
    })
  }

  return {
    getByQuery,
    count,
    distinct,
    create,
    updateMany,
    deleteByQuery,

    getById,
    updateById,
    deleteById,
  }
}
