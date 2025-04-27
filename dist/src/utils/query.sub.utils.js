import memoize from 'moize';
import { parseFilter } from 'mongodb-query-parser';
import { memoOptions } from '../mrq.config';
import { getSelect, getSort } from './query.utils';
const sortMap = {
    '1': 'asc',
    '-1': 'desc',
};
export const getQueryForSubarray = memoize(getQueryForSubarray_, memoOptions);
function getQueryForSubarray_(query, options = {}) {
    const filterStr = typeof query.filter !== 'string'
        ? JSON.stringify(query.filter)
        : query.filter;
    const filter = parseFilter(filterStr) ?? {};
    const sort = getSortForSubArray(query.sort);
    const select = getSelectForSubArray(query.select, options);
    const skip = query.skip ? parseInt(query.skip) : 0;
    const limit = query.limit ? parseInt(query.limit) : Infinity;
    return {
        filter,
        sort,
        select,
        skip,
        limit,
    };
}
function getSelectForSubArray(select, options = {}) {
    if (options.ignoreSelect)
        return null;
    const selectObject = getSelect(select);
    const selectArr = [];
    for (const path in selectObject)
        if (selectObject[path] === 1)
            selectArr.push(path);
    if (!selectArr.includes('_id'))
        selectArr.push('_id');
    return selectArr;
}
function getSortForSubArray(sort) {
    const sortObject = getSort(sort);
    const sortFieldsArr = [];
    const sortOrderArr = [];
    for (const sortField in sortObject) {
        sortFieldsArr.push(sortField);
        sortOrderArr.push(sortMap[sortObject[sortField]]);
    }
    return {
        sortFieldsArr,
        sortOrderArr,
    };
}
