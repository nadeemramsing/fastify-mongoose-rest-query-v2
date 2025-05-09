import { FastifyInstance } from 'fastify';
import { ISchemaOptionSub } from '../mrq.interfaces';
export declare const subRoute: (modelName: string, schemaOptions: Omit<ISchemaOptionSub, "endpointName">) => (app: FastifyInstance) => Promise<void>;
