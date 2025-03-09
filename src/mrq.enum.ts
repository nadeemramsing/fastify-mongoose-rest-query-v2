export enum HandlerAccessEnum {
  // MAIN
  CREATE_INDEX = 'CREATE_INDEX',
  GET_BY_QUERY = 'GET_BY_QUERY',
  COUNT = 'COUNT',
  DISTINCT = 'DISTINCT',
  CREATE = 'CREATE',
  DELETE_BY_QUERY = 'DELETE_BY_QUERY',
  UPDATE_MANY = 'UPDATE_MANY',

  // MAIN WITH ID
  GET_BY_ID = 'GET_BY_ID',
  UPDATE_BY_ID = 'UPDATE_BY_ID',
  DELETE_BY_ID = 'DELETE_BY_ID',

  // SUB
  GET_BY_QUERY_SUB = 'GET_BY_QUERY_SUB',
  COUNT_SUB = 'COUNT_SUB',
  DISTINCT_SUB = 'DISTINCT_SUB',
  CREATE_SUB = 'CREATE_SUB',
  UPDATE_MANY_SUB = 'UPDATE_MANY_SUB',
  DELETE_BY_QUERY_SUB = 'DELETE_BY_QUERY_SUB',

  // SUB WITH ID
  GET_BY_ID_SUB = 'GET_BY_ID_SUB',
  UPDATE_BY_ID_SUB = 'UPDATE_BY_ID_SUB',
  DELETE_BY_ID_SUB = 'DELETE_BY_ID_SUB',
}

export const ALL_GET = [
  HandlerAccessEnum.GET_BY_QUERY,
  HandlerAccessEnum.GET_BY_QUERY_SUB,
  HandlerAccessEnum.GET_BY_ID,
  HandlerAccessEnum.GET_BY_ID_SUB,
  HandlerAccessEnum.COUNT,
  HandlerAccessEnum.COUNT_SUB,
  HandlerAccessEnum.DISTINCT,
  HandlerAccessEnum.DISTINCT_SUB,
]

export const ALL_POST = [HandlerAccessEnum.CREATE, HandlerAccessEnum.CREATE_SUB]

export const ALL_PUT = [
  HandlerAccessEnum.UPDATE_MANY,
  HandlerAccessEnum.UPDATE_MANY_SUB,
  HandlerAccessEnum.UPDATE_BY_ID,
  HandlerAccessEnum.UPDATE_BY_ID_SUB,
]

export const ALL_DELETE = [
  HandlerAccessEnum.DELETE_BY_QUERY,
  HandlerAccessEnum.DELETE_BY_QUERY_SUB,
  HandlerAccessEnum.DELETE_BY_ID,
  HandlerAccessEnum.DELETE_BY_ID_SUB,
]

export const ALL_HANDLERS = [...ALL_GET, ...ALL_POST, ...ALL_PUT, ...ALL_DELETE]
