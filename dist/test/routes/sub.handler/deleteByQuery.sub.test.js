import { getDocsInJSON } from '@test/setup/fixtures/get-docs-in-json.method';
import { resources } from '@test/setup/fixtures/resources';
import { mongoInit } from '@test/setup/init/mongo.init';
import { app } from '@test/setup/setup';
import { ObjectId } from 'bson';
import { filter, find } from 'lodash/fp';
const resourceId = ObjectId.createFromTime(1);
describe.sequential('/:id/subarray DELETE (deleteByQuery)', () => {
    it('should delete and return all non-deleted addresses of the resource when filter used', async () => {
        const resGet = await app.inject({
            method: 'GET',
            url: `/secure/admin/mrq/resources/${resourceId}/addresses`,
            query: {
                select: '_id',
            },
        });
        const $in = resGet.json().map((doc) => doc._id);
        const resDel = await app.inject({
            method: 'DELETE',
            url: `/secure/admin/mrq/resources/${resourceId}/addresses`,
            query: {
                filter: JSON.stringify({ _id: { $in } }),
            },
        });
        expect(resDel.statusCode).toBe(200);
        expect(resDel.json()).toMatchObject([]);
    });
    it('should delete and return deletedCount of all addresses of the resource with specified id and street ending with "A"', async () => {
        await mongoInit();
        const response = await app.inject({
            method: 'DELETE',
            url: `/secure/admin/mrq/resources/${resourceId}/addresses`,
            query: {
                filter: JSON.stringify({ street: { $regex: 'A$' } }),
            },
        });
        const resource = find({ _id: resourceId.toString() }, getDocsInJSON(resources));
        const addressesNotDeleted = filter((doc) => !doc.street?.endsWith?.('A'), resource.addresses);
        expect(response.statusCode).toBe(200);
        expect(response.json()).toMatchObject(addressesNotDeleted);
    });
});
