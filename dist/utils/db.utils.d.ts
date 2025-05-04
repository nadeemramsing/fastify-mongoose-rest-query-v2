import { FastifyInstance, FastifyRequest } from 'fastify';
import { Connection } from 'mongoose';
import { IRestOptions } from '../mrq.interfaces';
export declare function getSingleConnection(app: FastifyInstance, opts: IRestOptions): Promise<void>;
export declare function getDB(app: FastifyInstance, uri: string, schemas: IRestOptions['schemas']): Promise<Connection>;
export declare function closeConnections(): Promise<void>;
export declare function model(req: FastifyRequest, modelName: string): import("mongoose").Model<any, {}, {}, {}, any, any>;
