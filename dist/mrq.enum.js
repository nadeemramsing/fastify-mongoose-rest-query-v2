"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/mrq.enum.ts
var mrq_enum_exports = {};
__export(mrq_enum_exports, {
  ALL_DELETE: () => ALL_DELETE,
  ALL_GET: () => ALL_GET,
  ALL_HANDLERS: () => ALL_HANDLERS,
  ALL_POST: () => ALL_POST,
  ALL_PUT: () => ALL_PUT,
  HandlerAccessEnum: () => HandlerAccessEnum
});
module.exports = __toCommonJS(mrq_enum_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ALL_DELETE,
  ALL_GET,
  ALL_HANDLERS,
  ALL_POST,
  ALL_PUT,
  HandlerAccessEnum
});
//# sourceMappingURL=mrq.enum.js.map
