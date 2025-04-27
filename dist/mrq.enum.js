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
export {
  ALL_DELETE,
  ALL_GET,
  ALL_HANDLERS,
  ALL_POST,
  ALL_PUT,
  HandlerAccessEnum
};
//# sourceMappingURL=mrq.enum.js.map
