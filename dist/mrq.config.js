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

// src/mrq.config.ts
var mrq_config_exports = {};
__export(mrq_config_exports, {
  leanOptions: () => leanOptions,
  memoOptions: () => memoOptions,
  store: () => store,
  toJSONOptions: () => toJSONOptions
});
module.exports = __toCommonJS(mrq_config_exports);
var leanOptions = {
  virtuals: true,
  versionKey: false
};
var toJSONOptions = {
  virtuals: true,
  versionKey: false
};
var memoOptions = {
  maxAge: 30 * 24 * 60 * 60 * 1e3
  // 1 month
};
var store = {
  mongoPath: "",
  mongoUser: "",
  mongoPassword: ""
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  leanOptions,
  memoOptions,
  store,
  toJSONOptions
});
//# sourceMappingURL=mrq.config.js.map
