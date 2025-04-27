// src/utils/mongoose.utils.ts
import { httpErrors } from "@fastify/sensible";
import {
  DOCUMENT_NOT_FOUND,
  EMPTY_BODY,
  INVALID_BODY,
  SUBARRAY_NOT_FOUND,
  SUBITEM_NOT_FOUND
} from "../mrq.errors.js";
import { model } from "./db.utils.js";
import { leanOptions } from "../mrq.config.js";
import { find } from "lodash/fp.js";
function runStaticMethods({
  Model,
  docs,
  query,
  req
}) {
  for (const staticMethodName in Model.schema.statics) {
    if (query.select[staticMethodName] !== 1) continue;
    for (const doc of docs)
      doc[staticMethodName] = Model.schema.statics[staticMethodName].call(
        Model,
        doc,
        { req, query }
      );
  }
}
async function useSession(Model, req, cb) {
  const query = req.query;
  const shouldUseSession = query.useSession === "true";
  if (!shouldUseSession) return cb();
  const session = await Model.startSession();
  const res = await cb(session);
  session.endSession();
  return res;
}
function getArrayFromBodyWithId(body) {
  if (!Array.isArray(body))
    throw httpErrors.unprocessableEntity(
      `${INVALID_BODY}: body should be an array`
    );
  if (!body.length)
    throw httpErrors.unprocessableEntity(
      `${EMPTY_BODY}: body should contain at least one object`
    );
  body = body.filter((doc) => doc._id);
  if (!body.length)
    throw httpErrors.unprocessableEntity(
      `${INVALID_BODY}: body should contain at least one object with _id`
    );
  return body;
}
async function getSubarray(req, modelName, subPathName_, useLean = false) {
  const Model = model(req, modelName);
  const { id } = req.params;
  const [subPathName] = subPathName_.split(":");
  const p = Model.findById(id, {}, { req }).select(subPathName);
  const doc = await (useLean ? p.lean(leanOptions) : p);
  if (!doc) throw httpErrors.notFound(DOCUMENT_NOT_FOUND);
  if (!doc[subPathName]) throw httpErrors.notFound(SUBARRAY_NOT_FOUND);
  return {
    Model,
    doc,
    subarray: doc[subPathName]
  };
}
async function getChildarray(req, modelName, fullPathName, useLean = false) {
  const Model = model(req, modelName);
  const { id, subId } = req.params;
  const [subPathName, childPathName] = fullPathName.split(":");
  const p = Model.find(
    {
      _id: id,
      [`${subPathName}._id`]: subId
    },
    {},
    { req }
  ).select(`
      ${subPathName}._id
      ${subPathName}.${childPathName}
    `);
  const [doc] = await (useLean ? p.lean(leanOptions) : p) ?? [];
  if (!doc) throw httpErrors.notFound(DOCUMENT_NOT_FOUND);
  const subitem = find((subitem2) => subitem2._id.equals(subId), doc[subPathName]);
  if (!subitem) throw httpErrors.notFound(SUBITEM_NOT_FOUND);
  return {
    Model,
    doc,
    subitem,
    subarray: subitem[childPathName]
  };
}
export {
  getArrayFromBodyWithId,
  getChildarray,
  getSubarray,
  runStaticMethods,
  useSession
};
//# sourceMappingURL=mongoose.utils.js.map
