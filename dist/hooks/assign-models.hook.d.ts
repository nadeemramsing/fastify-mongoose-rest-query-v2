import { FastifyInstance, onRequestAsyncHookHandler } from 'fastify';
import { IModelToSchemaMap } from '../mrq.interfaces';
export declare const assignModelsHook: (app: FastifyInstance, modelToSchemaMap: IModelToSchemaMap) => onRequestAsyncHookHandler;
