import memoize from 'moize';
import { httpErrors } from '@fastify/sensible';
import { parseFilter, parseSort, parseProject } from 'mongodb-query-parser';
import { IMPLICIT_SELECT_ALL_NOT_ALLOWED } from '../mrq.errors';
import { memoOptions } from '../mrq.config';
export function getQuery(req, modelName, options = {}) {
    const securePaths = req.mongoose_conn.securePathsPerModel[modelName];
    return getQueryInternal(req.query, securePaths, options);
}
const getQueryInternal = memoize(getQueryInternal_, memoOptions);
function getQueryInternal_(query, securePaths, options = {}) {
    const filter = getFilter(query.filter);
    const sort = getSort(query.sort);
    const select = getSelect(query.select, securePaths, options);
    const populate = getPopulate(query.populate);
    const skip = query.skip ? parseInt(query.skip) : 0;
    const limit = query.limit ? parseInt(query.limit) : 0;
    return {
        filter,
        sort,
        select,
        populate,
        skip,
        limit,
    };
}
function getFilter(filter) {
    const filterStr = typeof filter !== 'string' ? JSON.stringify(filter) : filter;
    return parseFilter(filterStr) ?? {};
}
export function getSort(fields) {
    if (!fields)
        return {};
    const sort = {};
    const fieldList = fields.split(',').map((str) => str.trim());
    for (const field of fieldList) {
        if (field.startsWith('-'))
            sort[field.slice(1)] = -1;
        else
            sort[field] = 1;
    }
    return parseSort(JSON.stringify(sort));
}
export function getSelect(fields = '', securePaths = {}, options = {}) {
    if (options.ignoreSelect)
        return {};
    const select = {};
    const fieldList = fields
        .split(',')
        .map((str) => str.trim())
        .filter(Boolean);
    if (!fieldList.length)
        throw httpErrors.methodNotAllowed(`${IMPLICIT_SELECT_ALL_NOT_ALLOWED}: use select=all query param`);
    if (fieldList.includes('all'))
        return transformSecurePathsToSelect(securePaths);
    for (const field of fieldList) {
        if (securePaths[field])
            continue;
        if (field.startsWith('-'))
            select[field.slice(1)] = 0;
        else
            select[field] = 1;
    }
    return parseProject(JSON.stringify(select));
}
function transformSecurePathsToSelect(securePaths) {
    const select = {};
    for (const [path, value] of Object.entries(securePaths)) {
        if (value)
            select[path] = 0;
    }
    return select;
}
function getPopulate(populate) {
    return parsePopulate(populate);
}
function parsePopulate(populate) {
    try {
        const parsed = JSON.parse(populate);
        if (typeof parsed !== 'object')
            throw 1;
        // Sanitize normally is being done in parseFilter
        return parseFilter(JSON.stringify(parsed));
    }
    catch (e) {
        return populate;
    }
}
