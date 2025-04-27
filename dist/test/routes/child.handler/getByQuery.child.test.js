import { getDocsInJSON } from '@test/setup/fixtures/get-docs-in-json.method';
import { resources } from '@test/setup/fixtures/resources';
import { app } from '@test/setup/setup';
import { ObjectId } from 'bson';
import { find } from 'lodash/fp';
const resourceId = ObjectId.createFromTime(3);
const addressId = ObjectId.createFromTime(300);
describe.sequential('/:id/subarray/:subId/childarray GET (getByQuery.child)', () => {
    it('should return all aliases of the address', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/secure/admin/mrq/resources/${resourceId}/addresses/${addressId}/aliases`,
            query: {
                select: 'all',
            },
        });
        const resource = find({ _id: resourceId.toString() }, getDocsInJSON(resources));
        const address = find({ _id: addressId.toString() }, resource.addresses);
        expect(response.json()).toMatchObject(address.aliases);
    });
});
