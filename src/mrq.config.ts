export const leanOptions = {
  virtuals: true,
  versionKey: false,
}

export const toJSONOptions = {
  virtuals: true,
  versionKey: false,
}

export const memoOptions = {
  maxAge: 24 * 24 * 60 * 60 * 1_000, // 24 days
}

export const store = {
  mongoDatabaseName: '',
  mongoUser: '',
  mongoPassword: '',
  mongoBaseUrl: 'mongodb://localhost:27016',
  mongoAdminSource: 'admin',
  mongoMinPoolSize: 2,
  mongoMaxPoolSize: 20,
}
