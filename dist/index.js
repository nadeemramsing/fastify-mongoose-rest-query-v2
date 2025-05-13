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

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ALL_DELETE: () => ALL_DELETE,
  ALL_GET: () => ALL_GET,
  ALL_HANDLERS: () => ALL_HANDLERS,
  ALL_POST: () => ALL_POST,
  ALL_PUT: () => ALL_PUT,
  DOCUMENT_NOT_FOUND: () => DOCUMENT_NOT_FOUND,
  EMPTY_BODY: () => EMPTY_BODY,
  HandlerAccessEnum: () => HandlerAccessEnum,
  IMPLICIT_DELETE_ALL_NOT_ALLOWED: () => IMPLICIT_DELETE_ALL_NOT_ALLOWED,
  IMPLICIT_SELECT_ALL_NOT_ALLOWED: () => IMPLICIT_SELECT_ALL_NOT_ALLOWED,
  INVALID_BODY: () => INVALID_BODY,
  NO_DOCUMENT_FOUND: () => NO_DOCUMENT_FOUND,
  NO_SUBITEM_FOUND: () => NO_SUBITEM_FOUND,
  PATH_NOT_FOUND_IN_SCHEMA: () => PATH_NOT_FOUND_IN_SCHEMA,
  ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL: () => ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL,
  ROLE_DOES_NOT_HAVE_ACCESS_HOOK_LEVEL: () => ROLE_DOES_NOT_HAVE_ACCESS_HOOK_LEVEL,
  SCHEMA_NOT_REGISTERED: () => SCHEMA_NOT_REGISTERED,
  SESSION_NOT_FOUND: () => SESSION_NOT_FOUND,
  SUBARRAY_NOT_FOUND: () => SUBARRAY_NOT_FOUND,
  SUBITEM_NOT_FOUND: () => SUBITEM_NOT_FOUND,
  closeConnections: () => closeConnections,
  getDB: () => getDB,
  initConnection: () => initConnection,
  leanOptions: () => leanOptions,
  memoOptions: () => memoOptions,
  model: () => model,
  restify: () => restify,
  store: () => store,
  toJSONOptions: () => toJSONOptions
});
module.exports = __toCommonJS(index_exports);

// src/utils/db.utils.ts
var import_sensible = require("@fastify/sensible");
var import_mongoose = require("mongoose");
var import_fp = __toESM(require("lodash/fp"));
var import_promise_all = __toESM(require("promise-all"));

// src/mrq.errors.ts
var SCHEMA_NOT_REGISTERED = "SCHEMA_NOT_REGISTERED";
var SESSION_NOT_FOUND = "SESSION_NOT_FOUND";
var IMPLICIT_SELECT_ALL_NOT_ALLOWED = "IMPLICIT_SELECT_ALL_NOT_ALLOWED";
var ROLE_DOES_NOT_HAVE_ACCESS_HOOK_LEVEL = "ROLE_DOES_NOT_HAVE_ACCESS_HOOK_LEVEL";
var ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL = "ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL";
var PATH_NOT_FOUND_IN_SCHEMA = "PATH_NOT_FOUND_IN_SCHEMA";
var IMPLICIT_DELETE_ALL_NOT_ALLOWED = "IMPLICIT_DELETE_ALL_NOT_ALLOWED";
var NO_DOCUMENT_FOUND = "NO_DOCUMENT_FOUND";
var INVALID_BODY = "INVALID_BODY";
var EMPTY_BODY = "EMPTY_BODY";
var DOCUMENT_NOT_FOUND = "DOCUMENT_NOT_FOUND";
var SUBARRAY_NOT_FOUND = "SUBARRAY_NOT_FOUND";
var NO_SUBITEM_FOUND = "NO_SUBITEM_FOUND";
var SUBITEM_NOT_FOUND = "SUBITEM_NOT_FOUND";

// src/mrq.config.ts
var leanOptions = {
  virtuals: true,
  versionKey: false
};
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

// src/utils/db.utils.ts
var mongoUrl = `${store.mongoBaseUrl}/${store.mongoDatabaseName ?? ""}`;
var connGlobal;
async function initConnection() {
  connGlobal = await (0, import_mongoose.createConnection)(mongoUrl, {
    autoIndex: false,
    auth: {
      username: store.mongoUser,
      password: store.mongoPassword
    },
    authSource: store.mongoAdminSource,
    minPoolSize: store.mongoMinPoolSize,
    maxPoolSize: store.mongoMaxPoolSize
  }).asPromise();
}
async function getDB(app, databaseName, schemas) {
  let connDB;
  if (store.mongoDatabaseName) connDB = connGlobal;
  else
    connDB = await connGlobal.useDb(databaseName, { useCache: true }).asPromise();
  if (!connDB.get("hasMapModelsBeenCalled"))
    await mapModels(app, connDB, schemas);
  return connDB;
}
async function mapModels(app, connDB, schemas) {
  connDB.set("hasMapModelsBeenCalled", true);
  const p = {};
  connDB.securePathsPerModel = {};
  for (const modelName in schemas) {
    const { schema } = schemas[modelName];
    if (modelName in connDB.models) continue;
    const Model = connDB.model(modelName, schema);
    p[modelName] = Model.diffIndexes();
    schema.eachPath((path, schemaType) => {
      if (!connDB.securePathsPerModel[modelName])
        connDB.securePathsPerModel[modelName] = {};
      if (schemaType.options.secure)
        connDB.securePathsPerModel[modelName][path] = true;
    });
  }
  const diffs = await (0, import_promise_all.default)(p).then(
    import_fp.default.pickBy((v, k) => v.toDrop.length || v.toCreate.length)
  );
  const hasAnyDiff = Object.keys(diffs).length;
  if (hasAnyDiff)
    app.log.info("Result of diffIndexes:", JSON.stringify(diffs, null, 2));
}
async function closeConnections() {
  await connGlobal.close();
}
function model(req, modelName) {
  const Model = req.mongooseConn.models[modelName];
  if (!Model) throw import_sensible.httpErrors.badRequest(SCHEMA_NOT_REGISTERED);
  return Model;
}

// src/hooks/assign-models.hook.ts
var assignModelsHook = (app, opts) => {
  if (!app.hasRequestDecorator("models")) {
    app.decorateRequest("models", null);
  }
  if (!app.hasRequestDecorator("mrq-db-name")) {
    app.decorateRequest("mrq-db-name", "");
  }
  return async (req) => {
    req.mongooseConn = await getDB(
      app,
      req["mrq-db-name"],
      opts.schemas
    );
  };
};

// src/handler/main.handler.ts
var import_sensible4 = require("@fastify/sensible");

// src/utils/query.utils.ts
var import_moize = __toESM(require("moize"));
var import_sensible2 = require("@fastify/sensible");
var import_mongodb_query_parser = require("mongodb-query-parser");
function getQuery(req, modelName, options = {}) {
  const securePaths = req.mongooseConn.securePathsPerModel[modelName];
  return getQueryInternal(req.query, securePaths, options);
}
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
    throw import_sensible2.httpErrors.methodNotAllowed(
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

// src/mrq.enum.ts
var HandlerAccessEnum = /* @__PURE__ */ ((HandlerAccessEnum2) => {
  HandlerAccessEnum2["CREATE_INDEX"] = "CREATE_INDEX";
  HandlerAccessEnum2["GET_BY_QUERY"] = "GET_BY_QUERY";
  HandlerAccessEnum2["COUNT"] = "COUNT";
  HandlerAccessEnum2["DISTINCT"] = "DISTINCT";
  HandlerAccessEnum2["CREATE"] = "CREATE";
  HandlerAccessEnum2["DELETE_BY_QUERY"] = "DELETE_BY_QUERY";
  HandlerAccessEnum2["UPDATE_MANY"] = "UPDATE_MANY";
  HandlerAccessEnum2["GET_BY_ID"] = "GET_BY_ID";
  HandlerAccessEnum2["UPDATE_BY_ID"] = "UPDATE_BY_ID";
  HandlerAccessEnum2["DELETE_BY_ID"] = "DELETE_BY_ID";
  HandlerAccessEnum2["GET_BY_QUERY_SUB"] = "GET_BY_QUERY_SUB";
  HandlerAccessEnum2["COUNT_SUB"] = "COUNT_SUB";
  HandlerAccessEnum2["DISTINCT_SUB"] = "DISTINCT_SUB";
  HandlerAccessEnum2["CREATE_SUB"] = "CREATE_SUB";
  HandlerAccessEnum2["UPDATE_MANY_SUB"] = "UPDATE_MANY_SUB";
  HandlerAccessEnum2["DELETE_BY_QUERY_SUB"] = "DELETE_BY_QUERY_SUB";
  HandlerAccessEnum2["GET_BY_ID_SUB"] = "GET_BY_ID_SUB";
  HandlerAccessEnum2["UPDATE_BY_ID_SUB"] = "UPDATE_BY_ID_SUB";
  HandlerAccessEnum2["DELETE_BY_ID_SUB"] = "DELETE_BY_ID_SUB";
  return HandlerAccessEnum2;
})(HandlerAccessEnum || {});
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

// src/utils/mongoose.utils.ts
var import_sensible3 = require("@fastify/sensible");
var import_fp2 = __toESM(require("lodash/fp"));
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
    throw import_sensible3.httpErrors.unprocessableEntity(
      `${INVALID_BODY}: body should be an array`
    );
  if (!body.length)
    throw import_sensible3.httpErrors.unprocessableEntity(
      `${EMPTY_BODY}: body should contain at least one object`
    );
  body = body.filter((doc) => doc._id);
  if (!body.length)
    throw import_sensible3.httpErrors.unprocessableEntity(
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
  if (!doc) throw import_sensible3.httpErrors.notFound(DOCUMENT_NOT_FOUND);
  if (!doc[subPathName]) throw import_sensible3.httpErrors.notFound(SUBARRAY_NOT_FOUND);
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
  if (!doc) throw import_sensible3.httpErrors.notFound(DOCUMENT_NOT_FOUND);
  const subitem = import_fp2.default.find((subitem2) => subitem2._id.equals(subId), doc[subPathName]);
  if (!subitem) throw import_sensible3.httpErrors.notFound(SUBITEM_NOT_FOUND);
  return {
    Model,
    doc,
    subitem,
    subarray: subitem[childPathName]
  };
}

// src/handler/main.handler.ts
var getMainHandler = (modelName, handlerAccesses = []) => {
  const getByQuery2 = async (req, rep) => {
    if (!handlerAccesses.includes("GET_BY_QUERY" /* GET_BY_QUERY */))
      throw import_sensible4.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const Model = model(req, modelName);
    const query = getQuery(req, modelName);
    const docs = await Model.find(query.filter, query.select, { req }).populate(query.populate).sort(query.sort).collation({ locale: "simple", caseLevel: true }).limit(query.limit).skip(query.skip).lean(leanOptions);
    runStaticMethods({ Model, docs, query, req });
    return docs;
  };
  const count2 = async (req, rep) => {
    if (!handlerAccesses.includes("COUNT" /* COUNT */))
      throw import_sensible4.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const Model = model(req, modelName);
    const query = getQuery(req, modelName, { ignoreSelect: true });
    return { n: await Model.countDocuments(query.filter) };
  };
  const distinct2 = async (req, rep) => {
    if (!handlerAccesses.includes("DISTINCT" /* DISTINCT */))
      throw import_sensible4.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const params = req.params;
    const Model = model(req, modelName);
    const doesPathExists = Model.schema.path(params.path);
    if (!doesPathExists) throw import_sensible4.httpErrors.notFound(PATH_NOT_FOUND_IN_SCHEMA);
    const query = getQuery(req, modelName, { ignoreSelect: true });
    return Model.distinct(params.path, query.filter);
  };
  const create2 = async (req, rep) => {
    if (!handlerAccesses.includes("CREATE" /* CREATE */))
      throw import_sensible4.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const Model = model(req, modelName);
    let body = req.body;
    const isBodyAnArray = Array.isArray(body);
    if (isBodyAnArray && !body.length)
      throw import_sensible4.httpErrors.notFound(`${INVALID_BODY}: no object found in array`);
    if (!isBodyAnArray) body = [body];
    const docs = await useSession(
      Model,
      req,
      (session) => Model.create(body, { req, session, ordered: !!session })
    );
    const result = docs.map((doc) => doc.toJSON(toJSONOptions));
    return isBodyAnArray ? result : result[0];
  };
  const updateMany2 = async (req, rep) => {
    if (!handlerAccesses.includes("UPDATE_MANY" /* UPDATE_MANY */))
      throw import_sensible4.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const Model = model(req, modelName);
    const body = getArrayFromBodyWithId(req.body);
    const _id = { $in: body.map((item) => item._id) };
    const docs = await Model.find({ _id }).then(
      (docs2) => docs2.reduce((acc, v) => ({ ...acc, [v._id]: v }), {})
    );
    req.query.useSession = "true";
    const docsSaved = [];
    const isOverwrite = req.routeOptions.url?.endsWith?.("/overwrite");
    await useSession(Model, req, async (session) => {
      for (const item of body) {
        const doc = docs[item._id];
        const _prev = doc.toJSON(toJSONOptions);
        isOverwrite ? doc.overwrite(item) : doc.set(item);
        docsSaved.push(await doc.save({ req, session, _prev }));
      }
    });
    return docsSaved;
  };
  const deleteByQuery2 = async (req, rep) => {
    if (!handlerAccesses.includes("DELETE_BY_QUERY" /* DELETE_BY_QUERY */))
      throw import_sensible4.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const Model = model(req, modelName);
    const query = getQuery(req, modelName, { ignoreSelect: true });
    const isDeleteAll = !Object.keys(query.filter).length;
    if (isDeleteAll)
      throw import_sensible4.httpErrors.methodNotAllowed(
        `${IMPLICIT_DELETE_ALL_NOT_ALLOWED}: delete directly in database`
      );
    const { deletedCount } = await useSession(
      Model,
      req,
      (session) => Model.deleteMany(query.filter, { session })
    );
    if (!deletedCount) throw import_sensible4.httpErrors.notFound(NO_DOCUMENT_FOUND);
    return { deletedCount };
  };
  const getById2 = async (req, rep) => {
    if (!handlerAccesses.includes("GET_BY_ID" /* GET_BY_ID */))
      throw import_sensible4.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const Model = model(req, modelName);
    const { id } = req.params;
    const query = getQuery(req, modelName);
    const doc = await Model.findById(id, query.select, { req }).and(query.filter).populate(query.populate).lean(leanOptions);
    if (!doc) throw import_sensible4.httpErrors.notFound(DOCUMENT_NOT_FOUND);
    runStaticMethods({ Model, docs: [doc], query, req });
    return doc;
  };
  const updateById2 = async (req, rep) => {
    if (!handlerAccesses.includes("UPDATE_BY_ID" /* UPDATE_BY_ID */))
      throw import_sensible4.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const Model = model(req, modelName);
    const { id } = req.params;
    const doc = await Model.findById(id);
    if (!doc) throw import_sensible4.httpErrors.notFound(DOCUMENT_NOT_FOUND);
    const _prev = doc.toJSON(toJSONOptions);
    req.routeOptions.url?.endsWith?.("/overwrite") ? doc.overwrite(req.body) : doc.set(req.body);
    await useSession(
      Model,
      req,
      // @ts-ignore: custom arg req
      (session) => doc.save({ req, session, _prev })
    );
    return doc.toJSON(toJSONOptions);
  };
  const deleteById2 = async (req, rep) => {
    if (!handlerAccesses.includes("DELETE_BY_ID" /* DELETE_BY_ID */))
      throw import_sensible4.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const Model = model(req, modelName);
    const { id: _id } = req.params;
    const { deletedCount } = await useSession(
      Model,
      req,
      (session) => Model.deleteOne({ _id }, { session })
    );
    if (!deletedCount) throw import_sensible4.httpErrors.notFound(DOCUMENT_NOT_FOUND);
    return { deletedCount };
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

// src/hooks/role.hook.ts
var import_sensible5 = require("@fastify/sensible");
var roleHook = (opts) => {
  return async (req, rep) => {
    if (req.role !== opts.role) throw import_sensible5.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HOOK_LEVEL);
  };
};

// src/handler/sub.handler.ts
var import_sensible7 = require("@fastify/sensible");

// src/services/sub.service.ts
var import_bson = require("bson");
var import_fp3 = __toESM(require("lodash/fp"));
var import_sift = __toESM(require("sift"));
var import_sensible6 = require("@fastify/sensible");
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
    throw import_sensible6.httpErrors.methodNotAllowed(IMPLICIT_DELETE_ALL_NOT_ALLOWED);
  const subarrayToDelete = import_fp3.default.filter(
    (0, import_sift.default)(query.filter),
    subarray
  );
  if (subarrayToDelete.length === 0) throw import_sensible6.httpErrors.notFound(NO_SUBITEM_FOUND);
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
    throw import_sensible6.httpErrors.notFound(SUBITEM_NOT_FOUND);
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
  if (!subitem) throw import_sensible6.httpErrors.notFound(SUBITEM_NOT_FOUND);
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
  if (!subitem) throw import_sensible6.httpErrors.notFound(SUBITEM_NOT_FOUND);
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
  getSubarray: getSubarray2,
  subIdName,
  subPathName
}) => {
  const getByQuery2 = async (req, rep) => {
    if (!handlerAccesses.includes("GET_BY_ID_SUB" /* GET_BY_ID_SUB */))
      throw import_sensible7.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const { subarray } = await getSubarray2(req, modelName, subPathName, true);
    const query = getQueryForSubarray(req.query);
    return getByQuery({ query, subarray });
  };
  const count2 = async (req, rep) => {
    if (!handlerAccesses.includes("COUNT_SUB" /* COUNT_SUB */))
      throw import_sensible7.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const { subarray } = await getSubarray2(req, modelName, subPathName, true);
    const query = getQueryForSubarray(req.query, { ignoreSelect: true });
    return count({ query, subarray });
  };
  const distinct2 = async (req, rep) => {
    if (!handlerAccesses.includes("DISTINCT_SUB" /* DISTINCT_SUB */))
      throw import_sensible7.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const { subarray } = await getSubarray2(req, modelName, subPathName, true);
    const query = getQueryForSubarray(req.query, { ignoreSelect: true });
    const { path } = req.params;
    return distinct({ query, path, subarray });
  };
  const create2 = async (req, rep) => {
    if (!handlerAccesses.includes("CREATE_SUB" /* CREATE_SUB */))
      throw import_sensible7.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const { Model, doc, subarray } = await getSubarray2(
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
      throw import_sensible7.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const { Model, doc, subarray } = await getSubarray2(
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
      throw import_sensible7.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const { Model, doc, subarray } = await getSubarray2(
      req,
      modelName,
      subPathName
    );
    const query = getQueryForSubarray(req.query, { ignoreSelect: true });
    return deleteByQuery({ doc, Model, req, subarray, query });
  };
  const getById2 = async (req, rep) => {
    if (!handlerAccesses.includes("GET_BY_ID_SUB" /* GET_BY_ID_SUB */))
      throw import_sensible7.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const { subarray } = await getSubarray2(req, modelName, subPathName);
    const params = req.params;
    const query = getQueryForSubarray(req.query);
    return getById({ query, subarray, subId: params[subIdName] });
  };
  const updateById2 = async (req, rep) => {
    if (!handlerAccesses.includes("UPDATE_BY_ID_SUB" /* UPDATE_BY_ID_SUB */))
      throw import_sensible7.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const { Model, doc, subarray } = await getSubarray2(
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
      throw import_sensible7.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const { Model, doc, subarray } = await getSubarray2(
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

// src/utils/misc.utils.ts
function countCharacter(char, word) {
  return word.split(char).length - 1;
}

// src/routes/sub.route.ts
var subRoute = (modelName, schemaOptions) => async (app) => {
  const { schema } = schemaOptions;
  for (const [subPathName, schemaInstance] of Object.entries(schema.obj)) {
    if (!Array.isArray(schemaInstance)) continue;
    schemaOptions.subPathName += subPathName + ":";
    const subHandler = getSubHandler(modelName, schemaOptions);
    let prefix = `/${subPathName}`;
    app.get(prefix, subHandler.getByQuery);
    app.get(`${prefix}/count`, subHandler.count);
    app.get(`${prefix}/distinct/:path`, subHandler.distinct);
    app.post(prefix, subHandler.create);
    app.put(prefix, subHandler.updateMany);
    app.put(`${prefix}/overwrite`, subHandler.updateMany);
    app.delete(prefix, subHandler.deleteByQuery);
    prefix += `/:${schemaOptions.subIdName}`;
    app.get(prefix, subHandler.getById);
    app.put(prefix, subHandler.updateById);
    app.put(`${prefix}/overwrite`, subHandler.updateById);
    app.delete(prefix, subHandler.deleteById);
    const noOfColons = countCharacter(":", schemaOptions.subPathName);
    if (noOfColons > 2) continue;
    for (const childSchemaInstance of schemaInstance) {
      const childRoute = subRoute(modelName, {
        ...schemaOptions,
        schema: childSchemaInstance,
        getSubarray: getChildarray,
        subIdName: "childId"
      });
      app.register(childRoute, { prefix });
    }
  }
};

// src/routes/main.route.ts
var mainRoute = (opts) => async (app) => {
  app.addHook("onRequest", roleHook(opts));
  for (const [
    modelName,
    { endpointName, schema, handlerAccesses }
  ] of Object.entries(opts.schemas)) {
    const mainHandler = getMainHandler(modelName, handlerAccesses);
    let prefix = `/${endpointName}`;
    app.get(prefix, mainHandler.getByQuery);
    app.get(`${prefix}/count`, mainHandler.count);
    app.get(`${prefix}/distinct/:path`, mainHandler.distinct);
    app.post(prefix, mainHandler.create);
    app.put(prefix, mainHandler.updateMany);
    app.put(`${prefix}/overwrite`, mainHandler.updateMany);
    app.delete(prefix, mainHandler.deleteByQuery);
    prefix += `/:id`;
    app.get(prefix, mainHandler.getById);
    app.put(prefix, mainHandler.updateById);
    app.put(`${prefix}/overwrite`, mainHandler.updateById);
    app.delete(prefix, mainHandler.deleteById);
    app.register(
      subRoute(modelName, {
        schema,
        handlerAccesses,
        getSubarray,
        subPathName: "",
        subIdName: "subId"
      }),
      { prefix }
    );
  }
};

// src/index.ts
var restify = (opts) => async (app) => {
  app.addHook("onRequest", assignModelsHook(app, opts));
  app.addHook(
    "onRoute",
    ({ url, method }) => app.log.info(`Endpoint created: ${url} ${method}`)
  );
  app.addHook("onClose", closeConnections);
  app.register(mainRoute(opts));
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ALL_DELETE,
  ALL_GET,
  ALL_HANDLERS,
  ALL_POST,
  ALL_PUT,
  DOCUMENT_NOT_FOUND,
  EMPTY_BODY,
  HandlerAccessEnum,
  IMPLICIT_DELETE_ALL_NOT_ALLOWED,
  IMPLICIT_SELECT_ALL_NOT_ALLOWED,
  INVALID_BODY,
  NO_DOCUMENT_FOUND,
  NO_SUBITEM_FOUND,
  PATH_NOT_FOUND_IN_SCHEMA,
  ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL,
  ROLE_DOES_NOT_HAVE_ACCESS_HOOK_LEVEL,
  SCHEMA_NOT_REGISTERED,
  SESSION_NOT_FOUND,
  SUBARRAY_NOT_FOUND,
  SUBITEM_NOT_FOUND,
  closeConnections,
  getDB,
  initConnection,
  leanOptions,
  memoOptions,
  model,
  restify,
  store,
  toJSONOptions
});
//# sourceMappingURL=index.js.map
