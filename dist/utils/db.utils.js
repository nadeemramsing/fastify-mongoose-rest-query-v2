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

// src/utils/db.utils.ts
var db_utils_exports = {};
__export(db_utils_exports, {
  closeConnections: () => closeConnections,
  getDB: () => getDB,
  model: () => model
});
module.exports = __toCommonJS(db_utils_exports);
var import_sensible = require("@fastify/sensible");
var import_mongoose = require("mongoose");
var import_fp = __toESM(require("lodash/fp"));
var import_promise_all = __toESM(require("promise-all"));

// src/mrq.errors.ts
var SCHEMA_NOT_REGISTERED = "SCHEMA_NOT_REGISTERED";

// src/mrq.config.ts
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
var conn = (0, import_mongoose.createConnection)(mongoUrl, {
  autoIndex: false,
  auth: {
    username: store.mongoUser,
    password: store.mongoPassword
  },
  authSource: store.mongoAdminSource,
  minPoolSize: store.mongoMinPoolSize,
  maxPoolSize: store.mongoMaxPoolSize
});
async function getDB(app, databaseName, schemas) {
  let connDB;
  if (store.mongoDatabaseName) connDB = conn;
  else connDB = conn.useDb(databaseName, { useCache: true });
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
  await conn.close();
}
function model(req, modelName) {
  const Model = req.mongooseConn.models[modelName];
  if (!Model) throw import_sensible.httpErrors.badRequest(SCHEMA_NOT_REGISTERED);
  return Model;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  closeConnections,
  getDB,
  model
});
//# sourceMappingURL=db.utils.js.map
