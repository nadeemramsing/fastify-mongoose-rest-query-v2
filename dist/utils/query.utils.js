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

// src/utils/query.utils.ts
var query_utils_exports = {};
__export(query_utils_exports, {
  getQuery: () => getQuery,
  getSelect: () => getSelect,
  getSort: () => getSort
});
module.exports = __toCommonJS(query_utils_exports);
var import_moize = __toESM(require("moize"));
var import_sensible = require("@fastify/sensible");
var import_mongodb_query_parser = require("mongodb-query-parser");

// src/mrq.errors.ts
var IMPLICIT_SELECT_ALL_NOT_ALLOWED = "IMPLICIT_SELECT_ALL_NOT_ALLOWED";

// src/mrq.config.ts
var memoOptions = {
  maxAge: 30 * 24 * 60 * 60 * 1e3
  // 1 month
};

// src/utils/query.utils.ts
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
    throw import_sensible.httpErrors.methodNotAllowed(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getQuery,
  getSelect,
  getSort
});
//# sourceMappingURL=query.utils.js.map
