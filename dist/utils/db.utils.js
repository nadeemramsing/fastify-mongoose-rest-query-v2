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

// src/utils/db.utils.ts
var pool = {};
async function getDB(app, uri, schemas) {
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
async function closeConnections() {
  const p = [];
  for (const uri in pool) p.push(pool[uri].close());
  await Promise.allSettled(p);
}
function model(req, modelName) {
  const Model = req.mongoose_conn.models[modelName];
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
