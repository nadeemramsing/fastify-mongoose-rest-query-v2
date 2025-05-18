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

// src/hooks/get-models.hook.ts
var get_models_hook_exports = {};
__export(get_models_hook_exports, {
  getModelsHook: () => getModelsHook
});
module.exports = __toCommonJS(get_models_hook_exports);

// src/utils/db.utils.ts
var import_sensible = require("@fastify/sensible");
var import_mongoose = require("mongoose");
var import_fp = __toESM(require("lodash/fp"));
var import_promise_all = __toESM(require("promise-all"));

// src/mrq.config.ts
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
  mongoMaxPoolSize: 20
};

// src/utils/db.utils.ts
var connGlobal;
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
    const schema = schemas[modelName];
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

// src/hooks/get-models.hook.ts
var getModelsHook = (app, modelToSchemaMap) => {
  if (!app.hasRequestDecorator("mrq-db-name")) {
    app.decorateRequest("mrq-db-name", "");
  }
  return async (req) => {
    req.mongooseConn = await getDB(
      app,
      req["mrq-db-name"],
      modelToSchemaMap
    );
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getModelsHook
});
//# sourceMappingURL=get-models.hook.js.map
