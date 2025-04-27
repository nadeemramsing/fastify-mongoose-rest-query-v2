import { FastifyInstance, onRequestAsyncHookHandler } from 'fastify';
import { IRestOptions } from '../mrq.interfaces';
export declare const assignModelsHook: (app: FastifyInstance, opts: IRestOptions) => onRequestAsyncHookHandler;
