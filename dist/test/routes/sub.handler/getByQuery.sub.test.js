import { getDocsInJSON } from '@test/setup/fixtures/get-docs-in-json.method';
import { resources } from '@test/setup/fixtures/resources';
import { app } from '@test/setup/setup';
import { ObjectId } from 'bson';
import { filter, find } from 'lodash/fp';
const resourceId = ObjectId.createFromTime(1);
describe.sequential('/:id/subarray GET (getByQuery.sub)', () => {
    it('should return all addresses of the resource with specified id', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/secure/admin/mrq/resources/${resourceId}/addresses`,
            query: {
                select: 'all',
            },
        });
        const resource = find({ _id: resourceId.toString() }, getDocsInJSON(resources));
        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual(resource.addresses);
    });
    it('should return all addresses of resource with specified id and city=Beau Bassin', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/secure/admin/mrq/resources/${resourceId}/addresses`,
            query: {
                select: 'all',
                filter: JSON.stringify({ city: 'Beau Bassin' }),
            },
        });
        const resource = find({ _id: resourceId.toString() }, getDocsInJSON(resources));
        const addresses = filter({ city: 'Beau Bassin' }, resource.addresses);
        expect(response.statusCode).toBe(200);
        expect(response.json()).toMatchObject(addresses);
    });
    it('should return all addresses of resource with specified id and street ending with "A"', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/secure/admin/mrq/resources/${resourceId}/addresses`,
            query: {
                select: 'all',
                filter: JSON.stringify({ street: { $regex: 'A$' } }),
            },
        });
        const resource = find({ _id: resourceId.toString() }, getDocsInJSON(resources));
        const addresses = filter((doc) => doc.street?.endsWith?.('A'), resource.addresses);
        expect(response.statusCode).toBe(200);
        expect(response.json()).toMatchObject(addresses);
    });
});
