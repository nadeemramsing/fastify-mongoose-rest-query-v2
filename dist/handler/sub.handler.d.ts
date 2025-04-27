import { RouteHandlerMethod } from 'fastify';
import { ISchemaOption } from '../mrq.interfaces';
export declare const getSubHandler: (modelName: string, { subPathName, handlerAccesses, getSubarray, subIdName, }: Omit<ISchemaOption, "endpointName">) => {
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
