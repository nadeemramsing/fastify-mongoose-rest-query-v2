import { httpErrors } from "@fastify/sensible";
import { HandlerAccessEnum } from "../mrq.enum";
import * as subService from "../services/sub.service";
import { getQueryForSubarray } from "../utils/query.sub.utils";
import { ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL } from "../mrq.errors";
const getSubHandler = (modelName, {
  subPathName,
  handlerAccesses,
  getSubarray,
  subIdName
}) => {
  const getByQuery = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.GET_BY_ID_SUB))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const { subarray } = await getSubarray(req, modelName, subPathName, true);
    const query = getQueryForSubarray(req.query);
    return subService.getByQuery({ query, subarray });
  };
  const count = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.COUNT_SUB))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const { subarray } = await getSubarray(req, modelName, subPathName, true);
    const query = getQueryForSubarray(req.query, { ignoreSelect: true });
    return subService.count({ query, subarray });
  };
  const distinct = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.DISTINCT_SUB))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const { subarray } = await getSubarray(req, modelName, subPathName, true);
    const query = getQueryForSubarray(req.query, { ignoreSelect: true });
    const { path } = req.params;
    return subService.distinct({ query, path, subarray });
  };
  const create = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.CREATE_SUB))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const { Model, doc, subarray } = await getSubarray(
      req,
      modelName,
      subPathName
    );
    return subService.create({
      body: req.body,
      doc,
      Model,
      req,
      subarray
    });
  };
  const updateMany = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.UPDATE_MANY_SUB))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const { Model, doc, subarray } = await getSubarray(
      req,
      modelName,
      subPathName
    );
    return subService.updateMany({
      body: req.body,
      doc,
      Model,
      req,
      subarray
    });
  };
  const deleteByQuery = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.DELETE_BY_QUERY_SUB))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const { Model, doc, subarray } = await getSubarray(
      req,
      modelName,
      subPathName
    );
    const query = getQueryForSubarray(req.query, { ignoreSelect: true });
    return subService.deleteByQuery({ doc, Model, req, subarray, query });
  };
  const getById = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.GET_BY_ID_SUB))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const { subarray } = await getSubarray(req, modelName, subPathName);
    const params = req.params;
    const query = getQueryForSubarray(req.query);
    return subService.getById({ query, subarray, subId: params[subIdName] });
  };
  const updateById = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.UPDATE_BY_ID_SUB))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const { Model, doc, subarray } = await getSubarray(
      req,
      modelName,
      subPathName
    );
    const params = req.params;
    return subService.updateById({
      body: req.body,
      subId: params[subIdName],
      doc,
      Model,
      req,
      subarray
    });
  };
  const deleteById = async (req, rep) => {
    if (!handlerAccesses.includes(HandlerAccessEnum.DELETE_BY_ID_SUB))
      throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const { Model, doc, subarray } = await getSubarray(
      req,
      modelName,
      subPathName
    );
    const params = req.params;
    return subService.deleteById({
      doc,
      Model,
      req,
      subarray,
      subId: params[subIdName]
    });
  };
  return {
    getByQuery,
    count,
    distinct,
    create,
    updateMany,
    deleteByQuery,
    getById,
    updateById,
    deleteById
  };
};
export {
  getSubHandler
};
//# sourceMappingURL=sub.handler.js.map
