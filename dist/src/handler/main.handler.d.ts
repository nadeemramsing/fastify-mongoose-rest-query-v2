import { RouteHandlerMethod } from 'fastify';
import { HandlerAccessEnum } from '../mrq.enum';
export declare const getMainHandler: (modelName: string, handlerAccesses?: HandlerAccessEnum[]) => {
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
