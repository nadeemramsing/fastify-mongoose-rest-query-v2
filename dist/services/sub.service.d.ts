import { Model, Types } from 'mongoose';
import { FastifyRequest } from 'fastify';
import { MrqDocument, MrqQuery } from '../mrq.interfaces';
interface IBaseOptions {
    body: any;
    doc: MrqDocument;
    query: Omit<MrqQuery, 'populate'>;
    Model: Model<any>;
    path: string;
    req: FastifyRequest;
    subarray: any[] | Types.DocumentArray<Types.Subdocument>;
    subId: string;
}
export declare function getByQuery({ query, subarray, }: Pick<IBaseOptions, 'query' | 'subarray'>): Promise<any>;
export declare function count({ query, subarray, }: Pick<IBaseOptions, 'query' | 'subarray'>): Promise<number>;
export declare function distinct({ query, path, subarray, }: Pick<IBaseOptions, 'query' | 'path' | 'subarray'>): Promise<any[]>;
export declare function create({ body, doc, Model, req, subarray, }: Pick<IBaseOptions, 'body' | 'doc' | 'Model' | 'req' | 'subarray'>): Promise<any[]>;
export declare function updateMany({ body, doc, Model, req, subarray, }: Pick<IBaseOptions, 'body' | 'doc' | 'Model' | 'req' | 'subarray'> & {
    subarray: Types.DocumentArray<Types.Subdocument>;
}): Promise<any[]>;
export declare function deleteByQuery({ doc, query, Model, req, subarray, }: Pick<IBaseOptions, 'doc' | 'query' | 'Model' | 'req' | 'subarray'> & {
    subarray: Types.DocumentArray<Types.Subdocument>;
}): Promise<import("mongoose").FlattenMaps<Types.Subdocument<unknown, any, any> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>[]>;
export declare function getById({ query, subarray, subId, }: Pick<IBaseOptions, 'query' | 'subarray' | 'subId'>): Promise<any>;
export declare function updateById({ body, doc, Model, req, subarray, subId, }: Pick<IBaseOptions, 'body' | 'doc' | 'Model' | 'req' | 'subarray' | 'subId'> & {
    subarray: Types.DocumentArray<Types.Subdocument>;
}): Promise<import("mongoose").FlattenMaps<Types.Subdocument<unknown, any, any> & Required<{
    _id: unknown;
}> & {
    __v: number;
}> | import("mongoose").FlattenMaps<Types.Subdocument<unknown, any, any> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>[]>;
export declare function deleteById({ doc, Model, req, subarray, subId, }: Pick<IBaseOptions, 'doc' | 'Model' | 'req' | 'subarray' | 'subId'> & {
    subarray: Types.DocumentArray<Types.Subdocument>;
}): Promise<import("mongoose").FlattenMaps<Types.Subdocument<unknown, any, any> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>[]>;
export {};
