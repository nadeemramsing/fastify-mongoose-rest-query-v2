import { app } from '@test/setup/setup';
import { ObjectId } from 'bson';
const resourceId = ObjectId.createFromTime(12345);
describe.sequential('/:id PUT (updateById > Error handling)', () => {
    it('should return "document_not_found" error when a non-existing id used', async () => {
        const resource = {
            name: "Nadeem's new name",
        };
        const response = await app.inject({
            method: 'PUT',
            url: `/secure/admin/mrq/resources/${resourceId}`,
            body: resource,
        });
        expect(response.statusCode).toBe(404);
        expect(response.json().message).toMatch(/^DOCUMENT_NOT_FOUND/);
    });
});
