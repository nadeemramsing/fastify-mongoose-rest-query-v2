import { app } from '@test/setup/setup';
import { isValidObjectId } from 'mongoose';
describe.sequential('/ POST (create > Error handling)', () => {
    it('should create and return 1 document with _id only when empty object body used', async () => {
        const resource = {};
        const response = await app.inject({
            method: 'POST',
            url: '/secure/admin/mrq/resources',
            body: resource,
        });
        expect(response.statusCode).toBe(200);
        expect(response.json()).toMatchObject(resource);
        expect(isValidObjectId(response.json()._id)).toBeTruthy();
    });
    it('should create and return 1 document with _id only when empty object body and session used', async () => {
        const resource = {};
        const response = await app.inject({
            method: 'POST',
            url: '/secure/admin/mrq/resources',
            body: resource,
            query: { useSession: 'true' },
        });
        expect(response.statusCode).toBe(200);
        expect(response.json()).toMatchObject(resource);
        expect(isValidObjectId(response.json()._id)).toBeTruthy();
    });
    it('should return [] when empty array body used', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/secure/admin/mrq/resources',
            body: [],
        });
        expect(response.statusCode).toBe(404);
        expect(response.json().message).toMatch(/^INVALID_BODY: no object found in array/);
    });
    it('should return [] when empty array body and session used', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/secure/admin/mrq/resources',
            body: [],
            query: { useSession: 'true' },
        });
        expect(response.statusCode).toBe(404);
        expect(response.json().message).toMatch(/^INVALID_BODY: no object found in array/);
    });
    it('should return "Resource validation failed" error when a body containing values not abiding to the schema used', async () => {
        const resource = {
            dateStart: 'a_random_string',
        };
        const response = await app.inject({
            method: 'POST',
            url: '/secure/admin/mrq/resources',
            body: resource,
        });
        expect(response.statusCode).toBe(500);
        expect(response.json().message).toMatch(/^Resource validation failed/);
    });
    it('should create resource and ignore non-existing fields in object body', async () => {
        const resource = {
            noField: 'a_random_string',
        };
        const response = await app.inject({
            method: 'POST',
            url: '/secure/admin/mrq/resources',
            body: resource,
        });
        const body = response.json();
        expect(response.statusCode).toBe(200);
        expect(body.noField).toBeUndefined();
        expect(isValidObjectId(body._id)).toBeTruthy();
    });
    it('should create resource and ignore non-existing fields in array body', async () => {
        const resource = [
            {
                noField: 'a_random_string',
            },
        ];
        const response = await app.inject({
            method: 'POST',
            url: '/secure/admin/mrq/resources',
            body: resource,
        });
        expect(response.statusCode).toBe(200);
        const body = response.json();
        expect(body[0].noField).toBeUndefined();
        expect(isValidObjectId(body[0]._id)).toBeTruthy();
    });
});
