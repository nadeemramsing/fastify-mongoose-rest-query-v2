import { FastifyInstance, FastifyRequest } from 'fastify';
import { Connection } from 'mongoose';
import { IModelToSchemaMap } from '../mrq.interfaces';
export declare function initConnection(): Promise<void>;
export declare function getDB(app: FastifyInstance, databaseName: string, schemas: IModelToSchemaMap): Promise<Connection>;
export declare function closeConnections(): Promise<void>;
export declare function model(req: FastifyRequest, modelName: string): import("mongoose").Model<any, {}, {}, {}, any, any>;
