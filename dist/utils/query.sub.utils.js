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

// src/utils/query.sub.utils.ts
var query_sub_utils_exports = {};
__export(query_sub_utils_exports, {
  getQueryForSubarray: () => getQueryForSubarray
});
module.exports = __toCommonJS(query_sub_utils_exports);
var import_moize2 = __toESM(require("moize"));
var import_mongodb_query_parser2 = require("mongodb-query-parser");

// src/mrq.config.ts
var memoOptions = {
  maxAge: 30 * 24 * 60 * 60 * 1e3
  // 1 month
};

// src/utils/query.utils.ts
var import_moize = __toESM(require("moize"));
var import_sensible = require("@fastify/sensible");
var import_mongodb_query_parser = require("mongodb-query-parser");

// src/mrq.errors.ts
var IMPLICIT_SELECT_ALL_NOT_ALLOWED = "IMPLICIT_SELECT_ALL_NOT_ALLOWED";

// src/utils/query.utils.ts
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getQueryForSubarray
});
//# sourceMappingURL=query.sub.utils.js.map
