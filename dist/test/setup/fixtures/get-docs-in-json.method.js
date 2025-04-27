import mapObj from 'map-obj';
import { ObjectId } from 'bson';
export const getDocsInJSON = (fixture) => fixture.map((item) => mapObj(item, (key, value) => {
    if (value instanceof ObjectId)
        return [key, value.toHexString()];
    if (value instanceof Date)
        return [key, value.toISOString()];
    return [key, value];
}, { deep: true }));
