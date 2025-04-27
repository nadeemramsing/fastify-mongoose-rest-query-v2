import { FastifyRequest } from 'fastify';
import { IGetQueryOptions, MrqQuery } from '../mrq.interfaces';
type TypeSecurePaths = {
    [path: string]: boolean;
};
export declare function getQuery(req: FastifyRequest, modelName: string, options?: IGetQueryOptions): MrqQuery;
export declare function getSort(fields: string): any;
export declare function getSelect(fields?: string, securePaths?: TypeSecurePaths, options?: IGetQueryOptions): any;
export {};
