import { app } from '@test/setup/setup';
describe.sequential('/ GET (distinct > Error handling)', () => {
    it('should return "path_not_found_in_schema" error when non-existing path used', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/secure/admin/mrq/resources/distinct/noField',
        });
        expect(response.statusCode).toBe(404);
        expect(response.json().message).toMatch(/^PATH_NOT_FOUND_IN_SCHEMA/);
    });
});
