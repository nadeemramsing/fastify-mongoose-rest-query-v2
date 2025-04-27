import { FastifyInstance } from 'fastify';
import { ISchemaOption } from '../mrq.interfaces';
export declare const subRoute: (modelName: string, schemaOptions: Omit<ISchemaOption, "endpointName">) => (app: FastifyInstance) => Promise<void>;
