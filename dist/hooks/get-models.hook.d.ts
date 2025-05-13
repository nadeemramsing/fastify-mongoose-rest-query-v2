import { FastifyInstance, onRequestAsyncHookHandler } from 'fastify';
import { IModelToSchemaMap } from '../mrq.interfaces';
export declare const getModelsHook: (app: FastifyInstance, modelToSchemaMap: IModelToSchemaMap) => onRequestAsyncHookHandler;
