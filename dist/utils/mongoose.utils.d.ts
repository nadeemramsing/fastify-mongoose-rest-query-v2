import { ClientSession, Model } from 'mongoose';
import { FastifyRequest } from 'fastify';
import { MrqDocument } from '../mrq.interfaces';
interface IRunStaticMethods<T> {
    Model: Model<T>;
    docs: any[];
    query: {
        select: {
            [key: string]: number;
        };
    };
    req: FastifyRequest;
}
export declare function runStaticMethods<T>({ Model, docs, query, req, }: IRunStaticMethods<T>): void;
export declare function useSession(Model: Model<any>, req: FastifyRequest, cb: (session?: ClientSession) => any): Promise<any>;
export declare function getArrayFromBodyWithId(body: any[]): any[];
export declare function getSubarray(req: FastifyRequest, modelName: string, subPathName_: string, useLean?: boolean): Promise<{
    Model: Model<any>;
    doc: MrqDocument;
    subarray: any;
}>;
export declare function getChildarray(req: FastifyRequest, modelName: string, fullPathName: string, useLean?: boolean): Promise<{
    Model: Model<any, {}, {}, {}, any, any>;
    doc: any;
    subitem: any;
    subarray: any;
}>;
export {};
