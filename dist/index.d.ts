import { FastifyInstance } from 'fastify';
import { IRestOptions } from './mrq.interfaces';
export * from './mrq.errors';
export * from './mrq.interfaces';
export * from './mrq.enum';
export * from './utils/db.utils';
export declare const restify: (opts: IRestOptions) => (app: FastifyInstance) => Promise<void>;
