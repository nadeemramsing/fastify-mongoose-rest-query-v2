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

// src/handler/main.handler.ts
var main_handler_exports = {};
__export(main_handler_exports, {
  getMainHandler: () => getMainHandler
});
module.exports = __toCommonJS(main_handler_exports);
var import_sensible4 = require("@fastify/sensible");

// src/utils/db.utils.ts
var import_sensible = require("@fastify/sensible");
var import_mongoose = require("mongoose");
var import_fp = __toESM(require("lodash/fp"));
var import_promise_all = __toESM(require("promise-all"));

// src/mrq.errors.ts
var SCHEMA_NOT_REGISTERED = "SCHEMA_NOT_REGISTERED";
var IMPLICIT_SELECT_ALL_NOT_ALLOWED = "IMPLICIT_SELECT_ALL_NOT_ALLOWED";
var ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL = "ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL";
var PATH_NOT_FOUND_IN_SCHEMA = "PATH_NOT_FOUND_IN_SCHEMA";
var IMPLICIT_DELETE_ALL_NOT_ALLOWED = "IMPLICIT_DELETE_ALL_NOT_ALLOWED";
var NO_DOCUMENT_FOUND = "NO_DOCUMENT_FOUND";
var INVALID_BODY = "INVALID_BODY";
var EMPTY_BODY = "EMPTY_BODY";
var DOCUMENT_NOT_FOUND = "DOCUMENT_NOT_FOUND";

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
function model(req, modelName) {
  const Model = req.mongooseConn.models[modelName];
  if (!Model) throw import_sensible.httpErrors.badRequest(SCHEMA_NOT_REGISTERED);
  return Model;
}

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

// src/handler/main.handler.ts
var getMainHandler = (modelName, handlerAccesses = []) => {
  const getByQuery = async (req, rep) => {
    if (!handlerAccesses.includes("GET_BY_QUERY" /* GET_BY_QUERY */))
      throw import_sensible4.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const Model = model(req, modelName);
    const query = getQuery(req, modelName);
    const docs = await Model.find(query.filter, query.select, { req }).populate(query.populate).sort(query.sort).collation({ locale: "simple", caseLevel: true }).limit(query.limit).skip(query.skip).lean(leanOptions);
    runStaticMethods({ Model, docs, query, req });
    return docs;
  };
  const count = async (req, rep) => {
    if (!handlerAccesses.includes("COUNT" /* COUNT */))
      throw import_sensible4.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const Model = model(req, modelName);
    const query = getQuery(req, modelName, { ignoreSelect: true });
    return { n: await Model.countDocuments(query.filter) };
  };
  const distinct = async (req, rep) => {
    if (!handlerAccesses.includes("DISTINCT" /* DISTINCT */))
      throw import_sensible4.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL);
    const params = req.params;
    const Model = model(req, modelName);
    const doesPathExists = Model.schema.path(params.path);
    if (!doesPathExists) throw import_sensible4.httpErrors.notFound(PATH_NOT_FOUND_IN_SCHEMA);
    const query = getQuery(req, modelName, { ignoreSelect: true });
    return Model.distinct(params.path, query.filter);
  };
  const create = async (req, rep) => {
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
  const updateMany = async (req, rep) => {
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
  const deleteByQuery = async (req, rep) => {
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
  const getById = async (req, rep) => {
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
  const updateById = async (req, rep) => {
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
  const deleteById = async (req, rep) => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getMainHandler
});
//# sourceMappingURL=main.handler.js.map
