import { IGetQueryOptions } from '../mrq.interfaces';
export declare const getQueryForSubarray: import("moize").Moized<typeof getQueryForSubarray_, Partial<{
    isDeepEqual: boolean;
    isPromise: boolean;
    isReact: boolean;
    isSerialized: boolean;
    isShallowEqual: boolean;
    matchesArg: import("moize").IsEqual;
    matchesKey: import("moize").IsMatchingKey;
    maxAge: number;
    maxArgs: number;
    maxSize: number;
    onCacheAdd: import("moize").OnCacheOperation<typeof getQueryForSubarray_>;
    onCacheChange: import("moize").OnCacheOperation<typeof getQueryForSubarray_>;
    onCacheHit: import("moize").OnCacheOperation<typeof getQueryForSubarray_>;
    onExpire: import("moize").OnExpire;
    profileName: string;
    serializer: import("moize").Serialize;
    transformArgs: import("moize").TransformKey;
    updateCacheForKey: import("moize").UpdateCacheForKey;
    updateExpire: boolean;
}> & Partial<{
    isDeepEqual: boolean;
    isPromise: boolean;
    isReact: boolean;
    isSerialized: boolean;
    isShallowEqual: boolean;
    matchesArg: import("moize").IsEqual;
    matchesKey: import("moize").IsMatchingKey;
    maxAge: number;
    maxArgs: number;
    maxSize: number;
    onCacheAdd: import("moize").OnCacheOperation<import("moize").Moizeable>;
    onCacheChange: import("moize").OnCacheOperation<import("moize").Moizeable>;
    onCacheHit: import("moize").OnCacheOperation<import("moize").Moizeable>;
    onExpire: import("moize").OnExpire;
    profileName: string;
    serializer: import("moize").Serialize;
    transformArgs: import("moize").TransformKey;
    updateCacheForKey: import("moize").UpdateCacheForKey;
    updateExpire: boolean;
}> & {
    maxAge: number;
}>;
declare function getQueryForSubarray_(query: any, options?: IGetQueryOptions): {
    filter: any;
    sort: {
        sortFieldsArr: string[];
        sortOrderArr: string[];
    };
    select: string[] | null;
    skip: number;
    limit: number;
};
export {};
