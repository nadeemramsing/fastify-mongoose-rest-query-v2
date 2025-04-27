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

// src/hooks/role.hook.ts
var role_hook_exports = {};
__export(role_hook_exports, {
  roleHook: () => roleHook
});
module.exports = __toCommonJS(role_hook_exports);
var import_sensible = require("@fastify/sensible");

// src/mrq.errors.ts
var ROLE_DOES_NOT_HAVE_ACCESS_HOOK_LEVEL = "ROLE_DOES_NOT_HAVE_ACCESS_HOOK_LEVEL";

// src/hooks/role.hook.ts
var roleHook = (opts) => {
  return async (req, rep) => {
    if (req.role !== opts.role) throw import_sensible.httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HOOK_LEVEL);
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  roleHook
});
//# sourceMappingURL=role.hook.js.map
