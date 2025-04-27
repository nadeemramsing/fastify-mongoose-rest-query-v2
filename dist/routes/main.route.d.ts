import { FastifyInstance } from 'fastify';
import { IRestOptions } from '../mrq.interfaces';
export declare const mainRoute: (opts: IRestOptions) => (app: FastifyInstance) => Promise<void>;
