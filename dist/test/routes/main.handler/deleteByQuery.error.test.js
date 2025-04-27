import { app } from '@test/setup/setup';
import { ObjectId } from 'bson';
const resourceId = ObjectId.createFromTime(12345);
describe.sequential('/ GET (deleteByQuery > Error handling)', () => {
    it('should return "IMPLICIT_DELETE_ALL_NOT_ALLOWED" error when no filter', async () => {
        const response = await app.inject({
            method: 'DELETE',
            url: '/secure/admin/mrq/resources',
        });
        expect(response.statusCode).toBe(405);
        expect(response.json().message).toMatch(/^IMPLICIT_DELETE_ALL_NOT_ALLOWED/);
    });
    it('should return "NO_DOCUMENT_FOUND" error when a non-existing id used', async () => {
        const response = await app.inject({
            method: 'DELETE',
            url: '/secure/admin/mrq/resources',
            query: {
                filter: JSON.stringify({ _id: resourceId }),
            },
        });
        expect(response.statusCode).toBe(404);
        expect(response.json().message).toMatch(/^NO_DOCUMENT_FOUND/);
    });
});
