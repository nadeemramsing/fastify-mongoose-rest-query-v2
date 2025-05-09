import { RouteHandlerMethod } from 'fastify';
import { ISchemaOptionSub } from '../mrq.interfaces';
export declare const getSubHandler: (modelName: string, { handlerAccesses, getSubarray, subIdName, subPathName, }: Omit<ISchemaOptionSub, "endpointName">) => {
    getByQuery: RouteHandlerMethod;
    count: RouteHandlerMethod;
    distinct: RouteHandlerMethod;
    create: RouteHandlerMethod;
    updateMany: RouteHandlerMethod;
    deleteByQuery: RouteHandlerMethod;
    getById: RouteHandlerMethod;
    updateById: RouteHandlerMethod;
    deleteById: RouteHandlerMethod;
};
