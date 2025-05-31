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

// src/utils/mongoose.utils.ts
var mongoose_utils_exports = {};
__export(mongoose_utils_exports, {
  getArrayFromBodyWithId: () => getArrayFromBodyWithId,
  getChildarray: () => getChildarray,
  getSubarray: () => getSubarray,
  runStaticMethods: () => runStaticMethods,
  useSession: () => useSession
});
module.exports = __toCommonJS(mongoose_utils_exports);
var import_sensible2 = require("@fastify/sensible");

// src/mrq.errors.ts
var SCHEMA_NOT_REGISTERED = "SCHEMA_NOT_REGISTERED";
var INVALID_BODY = "INVALID_BODY";
var EMPTY_BODY = "EMPTY_BODY";
var DOCUMENT_NOT_FOUND = "DOCUMENT_NOT_FOUND";
var SUBARRAY_NOT_FOUND = "SUBARRAY_NOT_FOUND";
var SUBITEM_NOT_FOUND = "SUBITEM_NOT_FOUND";

// src/utils/db.utils.ts
var import_sensible = require("@fastify/sensible");
var import_mongoose = require("mongoose");
var import_fp = __toESM(require("lodash/fp"));
var import_promise_all = __toESM(require("promise-all"));

// src/mrq.config.ts
var leanOptions = {
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

// src/utils/db.utils.ts
function model(req, modelName) {
  const Model = req.mongooseConn.models[modelName];
  if (!Model) throw import_sensible.httpErrors.badRequest(SCHEMA_NOT_REGISTERED);
  return Model;
}

// src/utils/mongoose.utils.ts
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
  const shouldUseSession = store.alwaysUseSession || query.useSession === "true";
  if (!shouldUseSession) return cb();
  const session = await Model.startSession();
  const res = await cb(session);
  session.endSession();
  return res;
}
function getArrayFromBodyWithId(body) {
  if (!Array.isArray(body))
    throw import_sensible2.httpErrors.unprocessableEntity(
      `${INVALID_BODY}: body should be an array`
    );
  if (!body.length)
    throw import_sensible2.httpErrors.unprocessableEntity(
      `${EMPTY_BODY}: body should contain at least one object`
    );
  body = body.filter((doc) => doc._id);
  if (!body.length)
    throw import_sensible2.httpErrors.unprocessableEntity(
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
  if (!doc) throw import_sensible2.httpErrors.notFound(DOCUMENT_NOT_FOUND);
  if (!doc[subPathName]) throw import_sensible2.httpErrors.notFound(SUBARRAY_NOT_FOUND);
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
  if (!doc) throw import_sensible2.httpErrors.notFound(DOCUMENT_NOT_FOUND);
  const subitem = import_fp2.default.find(
    (subitem2) => subitem2._id.equals(subId),
    doc[subPathName]
  );
  if (!subitem) throw import_sensible2.httpErrors.notFound(SUBITEM_NOT_FOUND);
  return {
    Model,
    doc,
    subitem,
    subarray: subitem[childPathName]
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getArrayFromBodyWithId,
  getChildarray,
  getSubarray,
  runStaticMethods,
  useSession
});
//# sourceMappingURL=mongoose.utils.js.map
