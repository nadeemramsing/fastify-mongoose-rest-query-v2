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

// src/utils/misc.utils.ts
var misc_utils_exports = {};
__export(misc_utils_exports, {
  countCharacter: () => countCharacter
});
module.exports = __toCommonJS(misc_utils_exports);
function countCharacter(char, word) {
  return word.split(char).length - 1;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  countCharacter
});
//# sourceMappingURL=misc.utils.js.map
