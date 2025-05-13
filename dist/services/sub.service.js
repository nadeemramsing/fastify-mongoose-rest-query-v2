"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/services/sub.service.ts
var sub_service_exports = {};
__export(sub_service_exports, {
  count: () => count,
  create: () => create,
  deleteById: () => deleteById,
  deleteByQuery: () => deleteByQuery,
  distinct: () => distinct,
  getById: () => getById,
  getByQuery: () => getByQuery,
  updateById: () => updateById,
  updateMany: () => updateMany
});
module.exports = __toCommonJS(sub_service_exports);
var import_bson = require("bson");
var import_fp3 = __toESM(require("lodash/fp"));
var import_sift = __toESM(require("sift"));

// src/mrq.config.ts
var toJSONOptions = {
  virtuals: true,
  versionKey: false
};
var memoOptions = {
  maxAge: 30 * 24 * 60 * 60 * 1e3
  // 1 month
};
var store = {
  mongoDatabaseName: "",
  mongoUser: "",
  mongoPassword: "",
  mongoBaseUrl: "mongodb://localhost:27016",
  mongoAdminSource: "admin",
  mongoMinPoolSize: 2,
  mongoMaxPoolSize: 20
};

// src/utils/mongoose.utils.ts
var import_sensible2 = require("@fastify/sensible");

// src/mrq.errors.ts
var IMPLICIT_DELETE_ALL_NOT_ALLOWED = "IMPLICIT_DELETE_ALL_NOT_ALLOWED";
var NO_SUBITEM_FOUND = "NO_SUBITEM_FOUND";
var SUBITEM_NOT_FOUND = "SUBITEM_NOT_FOUND";

// src/utils/db.utils.ts
var import_sensible = require("@fastify/sensible");
var import_mongoose = require("mongoose");
var import_fp = __toESM(require("lodash/fp"));
var import_promise_all = __toESM(require("promise-all"));
var mongoUrl = `${store.mongoBaseUrl}/${store.mongoDatabaseName ?? ""}`;

// src/utils/mongoose.utils.ts
var import_fp2 = __toESM(require("lodash/fp"));
async function useSession(Model, req, cb) {
  const query = req.query;
  const shouldUseSession = query.useSession === "true";
  if (!shouldUseSession) return cb();
  const session = await Model.startSession();
  const res = await cb(session);
  session.endSession();
  return res;
}

// src/services/sub.service.ts
var import_sensible3 = require("@fastify/sensible");
async function getByQuery({
  query,
  subarray
}) {
  return import_fp3.default.pipe(
    import_fp3.default.filter((0, import_sift.default)(query.filter)),
    query.sort.sortFieldsArr.length ? import_fp3.default.orderBy(query.sort.sortFieldsArr, query.sort.sortOrderArr) : (x) => x,
    import_fp3.default.drop(query.skip),
    import_fp3.default.take(query.limit),
    import_fp3.default.map(query.select.length > 1 ? import_fp3.default.pick(query.select) : (x) => x)
  )(subarray);
}
async function count({
  query,
  subarray
}) {
  return import_fp3.default.pipe(import_fp3.default.filter((0, import_sift.default)(query.filter)), import_fp3.default.size)(subarray);
}
async function distinct({
  query,
  path,
  subarray
}) {
  return import_fp3.default.pipe(
    import_fp3.default.filter((0, import_sift.default)(query.filter)),
    import_fp3.default.pluck(path),
    import_fp3.default.uniq,
    import_fp3.default.reject(import_fp3.default.isNil)
  )(subarray);
}
async function create({
  body,
  doc,
  Model,
  req,
  subarray
}) {
  const _prev = doc.toJSON(toJSONOptions);
  const idsMap = body.map((item) => (item._id = item._id ?? new import_bson.ObjectId(), item)).reduce((acc, v) => ({ ...acc, [v._id]: true }), {});
  for (const item of body) subarray.push(item);
  await useSession(
    Model,
    req,
    // @ts-ignore: custom arg req
    (session) => doc.save({ req, session, _prev })
  );
  const subarraySaved = subarray.map((subitem) => subitem.toJSON(toJSONOptions));
  const query = req.query;
  const shouldReturnAll = query.returnAll === "true";
  if (shouldReturnAll) return subarraySaved;
  return subarraySaved.filter((subitem) => idsMap[subitem._id]);
}
async function updateMany({
  body,
  doc,
  Model,
  req,
  subarray
}) {
  const _prev = doc.toJSON(toJSONOptions);
  const bodyIdsMap = body.reduce(
    (acc, v) => ({ ...acc, [v._id]: true }),
    {}
  );
  const [subitemsToUpdate, subitemsToNotUpdate] = import_fp3.default.partition(
    (subitem) => bodyIdsMap[subitem._id],
    subarray
  );
  for (const item of body) {
    const subitem = subarray.id(item._id);
    if (!subitem) continue;
    subitem.set(item);
  }
  if (req.routeOptions.url?.endsWith?.("/overwrite"))
    for (const subitem of subitemsToNotUpdate) subitem.deleteOne();
  await useSession(
    Model,
    req,
    // @ts-ignore: custom arg req
    (session) => doc.save({ req, session, _prev })
  );
  const query = req.query;
  const shouldReturnAll = query.returnAll === "true";
  return shouldReturnAll ? subarray.map((subitem) => subitem.toJSON(toJSONOptions)) : subitemsToUpdate.map((subitem) => subitem.toJSON(toJSONOptions));
}
async function deleteByQuery({
  doc,
  query,
  Model,
  req,
  subarray
}) {
  const isDeleteAll = !Object.keys(query.filter).length;
  if (isDeleteAll)
    throw import_sensible3.httpErrors.methodNotAllowed(IMPLICIT_DELETE_ALL_NOT_ALLOWED);
  const subarrayToDelete = import_fp3.default.filter(
    (0, import_sift.default)(query.filter),
    subarray
  );
  if (subarrayToDelete.length === 0) throw import_sensible3.httpErrors.notFound(NO_SUBITEM_FOUND);
  const _prev = doc.toJSON(toJSONOptions);
  for (const subitem of subarrayToDelete) subitem.deleteOne();
  await useSession(
    Model,
    req,
    // @ts-ignore: custom arg req
    (session) => doc.save({ req, session, _prev })
  );
  return subarray.map((subitem) => subitem.toJSON(toJSONOptions));
}
async function getById({
  query,
  subarray,
  subId
}) {
  const subitem = import_fp3.default.pipe(
    import_fp3.default.find((subitem2) => subitem2._id.equals(subId)),
    query.select.length > 1 ? import_fp3.default.pick(query.select) : (x) => x
  )(subarray);
  if (!subitem || !Object.keys(subitem).length)
    throw import_sensible3.httpErrors.notFound(SUBITEM_NOT_FOUND);
  return subitem;
}
async function updateById({
  body,
  doc,
  Model,
  req,
  subarray,
  subId
}) {
  const _prev = doc.toJSON(toJSONOptions);
  const subitem = subarray.id(subId);
  if (!subitem) throw import_sensible3.httpErrors.notFound(SUBITEM_NOT_FOUND);
  if (req.routeOptions.url?.endsWith?.("/overwrite")) subitem.overwrite(body);
  else subitem.set(body);
  await useSession(
    Model,
    req,
    // @ts-ignore: custom arg req
    (session) => doc.save({ req, session, _prev })
  );
  const query = req.query;
  const shouldReturnAll = query.returnAll === "true";
  return shouldReturnAll ? subarray.map((subitem2) => subitem2.toJSON(toJSONOptions)) : subitem.toJSON(toJSONOptions);
}
async function deleteById({
  doc,
  Model,
  req,
  subarray,
  subId
}) {
  const _prev = doc.toJSON(toJSONOptions);
  const subitem = subarray.id(subId);
  if (!subitem) throw import_sensible3.httpErrors.notFound(SUBITEM_NOT_FOUND);
  subitem.deleteOne();
  await useSession(
    Model,
    req,
    // @ts-ignore: custom arg req
    (session) => doc.save({ req, session, _prev })
  );
  return subarray.map((subitem2) => subitem2.toJSON(toJSONOptions));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  count,
  create,
  deleteById,
  deleteByQuery,
  distinct,
  getById,
  getByQuery,
  updateById,
  updateMany
});
//# sourceMappingURL=sub.service.js.map
