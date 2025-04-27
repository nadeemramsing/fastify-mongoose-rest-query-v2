// src/mrq.config.ts
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
export {
  leanOptions,
  memoOptions,
  toJSONOptions
};
//# sourceMappingURL=mrq.config.js.map
