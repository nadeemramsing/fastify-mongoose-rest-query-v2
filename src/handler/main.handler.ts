import { RouteHandlerMethod } from 'fastify'

export const getMainHandler = (modelName: string) => {
  const get: RouteHandlerMethod = async (req, rep) => {
    return 'TEST'
  }

  return {
    get,
  }
}
