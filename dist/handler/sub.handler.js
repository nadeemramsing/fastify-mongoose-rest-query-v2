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

// src/handler/sub.handler.ts
var sub_handler_exports = {};
__export(sub_handler_exports, {
  getSubHandler: () => getSubHandler
});
module.exports = __toCommonJS(sub_handler_exports);
var import_sensible5 = require("@fastify/sensible");

// src/mrq.enum.ts
var ALL_GET = [
  "GET_BY_QUERY" /* GET_BY_QUERY */,
  "GET_BY_QUERY_SUB" /* GET_BY_QUERY_SUB */,
  "GET_BY_ID" /* GET_BY_ID */,
  "GET_BY_ID_SUB" /* GET_BY_ID_SUB */,
  "COUNT" /* COUNT */,
  "COUNT_SUB" /* COUNT_SUB */,
  "DISTINCT" /* DISTINCT */,
  "DISTINCT_SUB" /* DISTINCT_SUB */
];
var ALL_POST = ["CREATE" /* CREATE */, "CREATE_SUB" /* CREATE_SUB */];
var ALL_PUT = [
  "UPDATE_MANY" /* UPDATE_MANY */,
  "UPDATE_MANY_SUB" /* UPDATE_MANY_SUB */,
  "UPDATE_BY_ID" /* UPDATE_BY_ID */,
  "UPDATE_BY_ID_SUB" /* UPDATE_BY_ID_SUB */
];
var ALL_DELETE = [
  "DELETE_BY_QUERY" /* DELETE_BY_QUERY */,
  "DELETE_BY_QUERY_SUB" /* DELETE_BY_QUERY_SUB */,
  "DELETE_BY_ID" /* DELETE_BY_ID */,
  "DELETE_BY_ID_SUB" /* DELETE_BY_ID_SUB */
];
var ALL_HANDLERS = [...ALL_GET, ...ALL_POST, ...ALL_PUT, ...ALL_DELETE];

// src/services/sub.service.ts
var import_bson = require("bson");
var import_fp3 = __toESM(require("lodash/fp"));
var import_sift = __toESM(require("sift"));

// src/mrq.config.ts
var toJSONOptions = {
  virtuals: true,
  versionKey: false
};
var memoOptions = {
  maxAge: 24 * 24 * 60 * 60 * 1e3
  // 24 days
};
var store = {
  alwaysUseSession: false,
  mongoDatabaseName: "",
  mongoUser: "",
  mongoPassword: "",
  mongoBaseUrl: "mongodb://localhost:27016",
  mongoAdminSource: "admin",
  mongoMinPoolSize: 2,
  mongoMaxPoolSize: 20,
  mongoReplicaSet: ""
};

// src/utils/mongoose.utils.ts
var import_sensible2 = require("@fastify/sensible");

// src/mrq.errors.ts
var IMPLICIT_SELECT_ALL_NOT_ALLOWED = "IMPLICIT_SELECT_ALL_NOT_ALLOWED";
var ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL = "ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL";
var IMPLICIT_DELETE_ALL_NOT_ALLOWED = "IMPLICIT_DELETE_ALL_NOT_ALLOWED";
var NO_SUBITEM_FOUND = "NO_SUBITEM_FOUND";
var SUBITEM_NOT_FOUND = "SUBITEM_NOT_FOUND";

// src/utils/db.utils.ts
var import_sensible = require("@fastify/sensible");
var import_mongoose = require("mongoose");
var import_fp = __toESM(require("lodash/fp"));
var import_promise_all = __toESM(require("promise-all"));

// src/utils/mongoose.utils.ts
var import_fp2 = __toESM(require("lodash/fp"));
async function useSession(Model, req, cb) {
  const query = req.query;
  const shouldUseSession = store.alwaysUseSession || query.useSession === "true";
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

// src/utils/query.sub.utils.ts
var import_moize2 = __toESM(require("moize"));
var import_mongodb_query_parser2 = require("mongodb-query-parser");

// src/utils/query.utils.ts
var import_moize = __toESM(require("moize"));
var import_sensible4 = require("@fastify/sensible");
var import_mongodb_query_parser = require("mongodb-query-parser");
var getQueryInternal = (0, import_moize.default)(getQueryInternal_, memoOptions);
function getQueryInternal_(query, securePaths, options = {}) {
  const filter = getFilter(query.filter);
  const sort = getSort(query.sort);
  const select = getSelect(query.select, securePaths, options);
  const populate = getPopulate(query.populate);
  const skip = query.skip ? parseInt(query.skip) : 0;
  const limit = query.limit ? parseInt(query.limit) : 0;
  return {
    filter,
    sort,
    select,
    populate,
    skip,
    limit
  };
}
function getFilter(filter) {
  const filterStr = typeof filter !== "string" ? JSON.stringify(filter) : filter;
  return (0, import_mongodb_query_parser.parseFilter)(filterStr) ?? {};
}
function getSort(fields) {
  if (!fields) return {};
  const sort = {};
  const fieldList = fields.split(",").map((str) => str.trim());
  for (const field of fieldList) {
    if (field.startsWith("-")) sort[field.slice(1)] = -1;
    else sort[field] = 1;
  }
  return (0, import_mongodb_query_parser.parseSort)(JSON.stringify(sort));
}
function getSelect(fields = "", securePaths = {}, options = {}) {
  if (options.ignoreSelect) return {};
  const select = {};
  const fieldList = fields.split(",").map((str) => str.trim()).filter(Boolean);
  if (!fieldList.length)
    throw import_sensible4.httpErrors.methodNotAllowed(
      `${IMPLICIT_SELECT_ALL_NOT_ALLOWED}: use select=all query param`
    );
  if (fieldList.includes("all"))
    return transformSecurePathsToSelect(securePaths);
  for (const field of fieldList) {
    if (securePaths[field]) continue;
    if (field.startsWith("-")) select[field.slice(1)] = 0;
    else select[field] = 1;
  }
  return (0, import_mongodb_query_parser.parseProject)(JSON.stringify(select));
}
function transformSecurePathsToSelect(securePaths) {
  const select = {};
  for (const [path, value] of Object.entries(securePaths)) {
    if (value) select[path] = 0;
  }
  return select;
}
function getPopulate(populate) {
  return parsePopulate(populate);
}
function parsePopulate(populate) {
  try {
    const parsed = JSON.parse(populate);
    if (typeof parsed !== "object") throw 1;
    return (0, import_mongodb_query_parser.parseFilter)(JSON.stringify(parsed));
  } catch (e) {
    return populate;
  }
}

// src/utils/query.sub.utils.ts
var sortMap = {
  "1": "asc",
  "-1": "desc"
};
var getQueryForSubarray = (0, import_moize2.default)(getQueryForSubarray_, memoOptions);
function getQueryForSubarray_(query, options = {}) {
  const filterStr = typeof query.filter !== "string" ? JSON.stringify(query.filter) : query.filter;
  const filter = (0, import_mongodb_query_parser2.parseFilter)(filterStr) ?? {};
  const sort = getSortForSubArray(query.sort);
  const select = getSelectForSubArray(query.select, options);
  const skip = query.skip ? parseInt(query.skip) : 0;
  const limit = query.limit ? parseInt(query.limit) : Infinity;
  return {
    filter,
    sort,
    select,
    skip,
    limit
  };
}
function getSelectForSubArray(select, options = {}) {
  if (options.ignoreSelect) return null;
  const selectObject = getSelect(select);
  const selectArr = [];
  for (const path in selectObject)
    if (selectObject[path] === 1) selectArr.push(path);
  if (!selectArr.includes("_id")) selectArr.push("_id");
  return selectArr;
}
function getSortForSubArray(sort) {
  const sortObject = getSort(sort);
  const sortFieldsArr = [];
  const sortOrderArr = [];
  for (const sortField in sortObject) {
    sortFieldsArr.push(sortField);
    sortOrderArr.push(sortMap[sortObject[sortField]]);
  }
  return {
    sortFieldsArr,
    sortOrderArr
  };
}

// src/handler/sub.handler.ts
var getSubHandler = (modelName, {
  handlerAccesses,
  getSubarray,
  subIdName,
  subPathName
}) => {
  const getByQuery2 = async (req, rep) => {
    if (!handlerAccesses.includes("GET_BY_ID_SUB" /* GET_BY_ID_SUB */))
      throw import_sensible5.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const { subarray } = await getSubarray(req, modelName, subPathName, true);
    const query = getQueryForSubarray(req.query);
    return getByQuery({ query, subarray });
  };
  const count2 = async (req, rep) => {
    if (!handlerAccesses.includes("COUNT_SUB" /* COUNT_SUB */))
      throw import_sensible5.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const { subarray } = await getSubarray(req, modelName, subPathName, true);
    const query = getQueryForSubarray(req.query, { ignoreSelect: true });
    return count({ query, subarray });
  };
  const distinct2 = async (req, rep) => {
    if (!handlerAccesses.includes("DISTINCT_SUB" /* DISTINCT_SUB */))
      throw import_sensible5.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const { subarray } = await getSubarray(req, modelName, subPathName, true);
    const query = getQueryForSubarray(req.query, { ignoreSelect: true });
    const { path } = req.params;
    return distinct({ query, path, subarray });
  };
  const create2 = async (req, rep) => {
    if (!handlerAccesses.includes("CREATE_SUB" /* CREATE_SUB */))
      throw import_sensible5.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const { Model, doc, subarray } = await getSubarray(
      req,
      modelName,
      subPathName
    );
    return create({
      body: req.body,
      doc,
      Model,
      req,
      subarray
    });
  };
  const updateMany2 = async (req, rep) => {
    if (!handlerAccesses.includes("UPDATE_MANY_SUB" /* UPDATE_MANY_SUB */))
      throw import_sensible5.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const { Model, doc, subarray } = await getSubarray(
      req,
      modelName,
      subPathName
    );
    return updateMany({
      body: req.body,
      doc,
      Model,
      req,
      subarray
    });
  };
  const deleteByQuery2 = async (req, rep) => {
    if (!handlerAccesses.includes("DELETE_BY_QUERY_SUB" /* DELETE_BY_QUERY_SUB */))
      throw import_sensible5.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const { Model, doc, subarray } = await getSubarray(
      req,
      modelName,
      subPathName
    );
    const query = getQueryForSubarray(req.query, { ignoreSelect: true });
    return deleteByQuery({ doc, Model, req, subarray, query });
  };
  const getById2 = async (req, rep) => {
    if (!handlerAccesses.includes("GET_BY_ID_SUB" /* GET_BY_ID_SUB */))
      throw import_sensible5.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const { subarray } = await getSubarray(req, modelName, subPathName);
    const params = req.params;
    const query = getQueryForSubarray(req.query);
    return getById({ query, subarray, subId: params[subIdName] });
  };
  const updateById2 = async (req, rep) => {
    if (!handlerAccesses.includes("UPDATE_BY_ID_SUB" /* UPDATE_BY_ID_SUB */))
      throw import_sensible5.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const { Model, doc, subarray } = await getSubarray(
      req,
      modelName,
      subPathName
    );
    const params = req.params;
    return updateById({
      body: req.body,
      subId: params[subIdName],
      doc,
      Model,
      req,
      subarray
    });
  };
  const deleteById2 = async (req, rep) => {
    if (!handlerAccesses.includes("DELETE_BY_ID_SUB" /* DELETE_BY_ID_SUB */))
      throw import_sensible5.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const { Model, doc, subarray } = await getSubarray(
      req,
      modelName,
      subPathName
    );
    const params = req.params;
    return deleteById({
      doc,
      Model,
      req,
      subarray,
      subId: params[subIdName]
    });
  };
  return {
    getByQuery: getByQuery2,
    count: count2,
    distinct: distinct2,
    create: create2,
    updateMany: updateMany2,
    deleteByQuery: deleteByQuery2,
    getById: getById2,
    updateById: updateById2,
    deleteById: deleteById2
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getSubHandler
});
//# sourceMappingURL=sub.handler.js.map
