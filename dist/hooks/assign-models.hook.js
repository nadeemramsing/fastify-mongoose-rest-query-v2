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

// src/hooks/assign-models.hook.ts
var assign_models_hook_exports = {};
__export(assign_models_hook_exports, {
  assignModelsHook: () => assignModelsHook
});
module.exports = __toCommonJS(assign_models_hook_exports);

// src/utils/db.utils.ts
var import_sensible = require("@fastify/sensible");
var import_mongoose = require("mongoose");
var import_fp = __toESM(require("lodash/fp"));
var import_promise_all = __toESM(require("promise-all"));

// src/mrq.config.ts
var memoOptions = {
  maxAge: 30 * 24 * 60 * 60 * 1e3
  // 1 month
};

// src/utils/db.utils.ts
var pool = {};
var singleConnection = null;
async function getDB(app, uri, schemas) {
  if (singleConnection) return singleConnection;
  let conn = pool[uri];
  if (!conn) {
    conn = (0, import_mongoose.createConnection)(uri, { autoIndex: false });
    await conn.asPromise();
    pool[uri] = conn;
    await mapModels(app, conn, schemas);
  }
  return conn;
}
async function mapModels(app, conn, schemas) {
  const p = {};
  conn.securePathsPerModel = {};
  for (const modelName in schemas) {
    const { schema } = schemas[modelName];
    if (modelName in conn.models) continue;
    const Model = conn.model(modelName, schema);
    p[modelName] = Model.diffIndexes();
    schema.eachPath((path, schemaType) => {
      if (!conn.securePathsPerModel[modelName])
        conn.securePathsPerModel[modelName] = {};
      if (schemaType.options.secure)
        conn.securePathsPerModel[modelName][path] = true;
    });
  }
  const diffs = await (0, import_promise_all.default)(p).then(
    import_fp.default.pickBy((v, k) => v.toDrop.length || v.toCreate.length)
  );
  const hasAnyDiff = Object.keys(diffs).length;
  if (hasAnyDiff)
    app.log.info("Result of diffIndexes:", JSON.stringify(diffs, null, 2));
}

// src/hooks/assign-models.hook.ts
var assignModelsHook = (app, opts) => {
  if (!app.hasRequestDecorator("models")) {
    app.decorateRequest("models", null);
  }
  if (!app.hasRequestDecorator("x-client-mongodb-path")) {
    app.decorateRequest("x-client-mongodb-path", "");
  }
  return async (req) => {
    req.mongooseConn = await getDB(
      app,
      req["x-client-mongodb-path"],
      opts.schemas
    );
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assignModelsHook
});
//# sourceMappingURL=assign-models.hook.js.map
