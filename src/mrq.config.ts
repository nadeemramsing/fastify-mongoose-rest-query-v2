export const leanOptions = {
  virtuals: true,
  versionKey: false,
}

export const toJSONOptions = {
  virtuals: true,
  versionKey: false,
}

export const memoizeOptions = {
  expiring: 30 * 24 * 60 * 60 * 1_000, // 1 month
  hashFunction: JSON.stringify,
}
