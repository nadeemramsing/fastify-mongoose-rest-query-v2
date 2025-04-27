import { httpErrors } from '@fastify/sensible';
import { ROLE_DOES_NOT_HAVE_ACCESS_HOOK_LEVEL } from '../mrq.errors';
export const roleHook = (opts) => {
    return async (req, rep) => {
        if (req.role !== opts.role)
            throw httpErrors.unauthorized(ROLE_DOES_NOT_HAVE_ACCESS_HOOK_LEVEL);
    };
};
