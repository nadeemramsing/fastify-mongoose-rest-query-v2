export declare enum HandlerAccessEnum {
    CREATE_INDEX = "CREATE_INDEX",
    GET_BY_QUERY = "GET_BY_QUERY",
    COUNT = "COUNT",
    DISTINCT = "DISTINCT",
    CREATE = "CREATE",
    DELETE_BY_QUERY = "DELETE_BY_QUERY",
    UPDATE_MANY = "UPDATE_MANY",
    GET_BY_ID = "GET_BY_ID",
    UPDATE_BY_ID = "UPDATE_BY_ID",
    DELETE_BY_ID = "DELETE_BY_ID",
    GET_BY_QUERY_SUB = "GET_BY_QUERY_SUB",
    COUNT_SUB = "COUNT_SUB",
    DISTINCT_SUB = "DISTINCT_SUB",
    CREATE_SUB = "CREATE_SUB",
    UPDATE_MANY_SUB = "UPDATE_MANY_SUB",
    DELETE_BY_QUERY_SUB = "DELETE_BY_QUERY_SUB",
    GET_BY_ID_SUB = "GET_BY_ID_SUB",
    UPDATE_BY_ID_SUB = "UPDATE_BY_ID_SUB",
    DELETE_BY_ID_SUB = "DELETE_BY_ID_SUB"
}
export declare const ALL_GET: HandlerAccessEnum[];
export declare const ALL_POST: HandlerAccessEnum[];
export declare const ALL_PUT: HandlerAccessEnum[];
export declare const ALL_DELETE: HandlerAccessEnum[];
export declare const ALL_HANDLERS: HandlerAccessEnum[];
