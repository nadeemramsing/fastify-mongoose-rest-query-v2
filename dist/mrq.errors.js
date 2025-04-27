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

// src/mrq.errors.ts
var mrq_errors_exports = {};
__export(mrq_errors_exports, {
  DOCUMENT_NOT_FOUND: () => DOCUMENT_NOT_FOUND,
  EMPTY_BODY: () => EMPTY_BODY,
  IMPLICIT_DELETE_ALL_NOT_ALLOWED: () => IMPLICIT_DELETE_ALL_NOT_ALLOWED,
  IMPLICIT_SELECT_ALL_NOT_ALLOWED: () => IMPLICIT_SELECT_ALL_NOT_ALLOWED,
  INVALID_BODY: () => INVALID_BODY,
  NO_DOCUMENT_FOUND: () => NO_DOCUMENT_FOUND,
  NO_SUBITEM_FOUND: () => NO_SUBITEM_FOUND,
  PATH_NOT_FOUND_IN_SCHEMA: () => PATH_NOT_FOUND_IN_SCHEMA,
  ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL: () => ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL,
  ROLE_DOES_NOT_HAVE_ACCESS_HOOK_LEVEL: () => ROLE_DOES_NOT_HAVE_ACCESS_HOOK_LEVEL,
  SCHEMA_NOT_REGISTERED: () => SCHEMA_NOT_REGISTERED,
  SESSION_NOT_FOUND: () => SESSION_NOT_FOUND,
  SUBARRAY_NOT_FOUND: () => SUBARRAY_NOT_FOUND,
  SUBITEM_NOT_FOUND: () => SUBITEM_NOT_FOUND
});
module.exports = __toCommonJS(mrq_errors_exports);
var SCHEMA_NOT_REGISTERED = "SCHEMA_NOT_REGISTERED";
var SESSION_NOT_FOUND = "SESSION_NOT_FOUND";
var IMPLICIT_SELECT_ALL_NOT_ALLOWED = "IMPLICIT_SELECT_ALL_NOT_ALLOWED";
var ROLE_DOES_NOT_HAVE_ACCESS_HOOK_LEVEL = "ROLE_DOES_NOT_HAVE_ACCESS_HOOK_LEVEL";
var ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL = "ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL";
var PATH_NOT_FOUND_IN_SCHEMA = "PATH_NOT_FOUND_IN_SCHEMA";
var IMPLICIT_DELETE_ALL_NOT_ALLOWED = "IMPLICIT_DELETE_ALL_NOT_ALLOWED";
var NO_DOCUMENT_FOUND = "NO_DOCUMENT_FOUND";
var INVALID_BODY = "INVALID_BODY";
var EMPTY_BODY = "EMPTY_BODY";
var DOCUMENT_NOT_FOUND = "DOCUMENT_NOT_FOUND";
var SUBARRAY_NOT_FOUND = "SUBARRAY_NOT_FOUND";
var NO_SUBITEM_FOUND = "NO_SUBITEM_FOUND";
var SUBITEM_NOT_FOUND = "SUBITEM_NOT_FOUND";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DOCUMENT_NOT_FOUND,
  EMPTY_BODY,
  IMPLICIT_DELETE_ALL_NOT_ALLOWED,
  IMPLICIT_SELECT_ALL_NOT_ALLOWED,
  INVALID_BODY,
  NO_DOCUMENT_FOUND,
  NO_SUBITEM_FOUND,
  PATH_NOT_FOUND_IN_SCHEMA,
  ROLE_DOES_NOT_HAVE_ACCESS_HANDLER_LEVEL,
  ROLE_DOES_NOT_HAVE_ACCESS_HOOK_LEVEL,
  SCHEMA_NOT_REGISTERED,
  SESSION_NOT_FOUND,
  SUBARRAY_NOT_FOUND,
  SUBITEM_NOT_FOUND
});
//# sourceMappingURL=mrq.errors.js.map
