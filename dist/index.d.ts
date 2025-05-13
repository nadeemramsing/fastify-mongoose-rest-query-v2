import { FastifyInstance } from 'fastify';
import { IRestOptions } from './mrq.interfaces';
export * from './mrq.errors';
export * from './mrq.interfaces';
export * from './mrq.enum';
export * from './mrq.config';
export * from './utils/db.utils';
export * from './hooks/get-models.hook';
export declare const restify: (opts: IRestOptions) => (app: FastifyInstance) => Promise<void>;
