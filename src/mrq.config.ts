export const leanOptions = {
  virtuals: true,
  versionKey: false,
}

export const toJSONOptions = {
  virtuals: true,
  versionKey: false,
}

export const memoOptions = {
  maxAge: 30 * 24 * 60 * 60 * 1_000, // 1 month
}

export const store = {
  mongoPath: '',
  mongoUser: '',
  mongoPassword: '',
  mongoAdminSource: 'admin',
}
