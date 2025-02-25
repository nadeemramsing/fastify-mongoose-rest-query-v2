import { onRequestAsyncHookHandler } from 'fastify'
import { httpErrors } from '@fastify/sensible'
import { IRestOptions } from '../mrq.interfaces'
import { ROLE_NOT_ALLOWED } from '../mrq.errors'

export const roleHook: (opts: IRestOptions) => onRequestAsyncHookHandler = (
  opts
) => {
  return async (req, rep) => {
    if (req.role !== opts.role) throw httpErrors.unauthorized(ROLE_NOT_ALLOWED)
  }
}
