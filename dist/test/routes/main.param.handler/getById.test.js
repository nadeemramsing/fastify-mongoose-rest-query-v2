import { getDocsInJSON } from '@test/setup/fixtures/get-docs-in-json.method';
import { resources } from '@test/setup/fixtures/resources';
import { app } from '@test/setup/setup';
import { ObjectId } from 'bson';
import { find, pick, pipe } from 'lodash/fp';
const resourceId = ObjectId.createFromTime(1);
const resourceIdZak = ObjectId.createFromTime(3);
describe.sequential('/:id GET (getById)', () => {
    //#region filter
    it('should return resource with specified id when no filter used', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/secure/admin/mrq/resources/${resourceId}`,
            query: {
                select: 'all',
            },
        });
        const resourceExpected = find({ name: 'Nadeem' }, getDocsInJSON(resources));
        delete resourceExpected?.auth?.password;
        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual(resourceExpected);
    });
    it('should return resource with specified id and 1 filter name=Nadeem', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/secure/admin/mrq/resources/${resourceId}`,
            query: {
                select: 'all',
                filter: JSON.stringify({ name: 'Nadeem' }),
            },
        });
        const resourceExpected = find({ name: 'Nadeem' }, getDocsInJSON(resources));
        delete resourceExpected?.auth?.password;
        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual(resourceExpected);
    });
    it('should return resource with specified id and 2 filters name=~mira&age>=10', async () => {
        const resourceId = ObjectId.createFromTime(2);
        const response = await app.inject({
            method: 'GET',
            url: `/secure/admin/mrq/resources/${resourceId}`,
            query: {
                select: 'all',
                filter: JSON.stringify({ name: { $regex: 'mira' }, age: { $gte: 10 } }),
            },
        });
        const resourceExpected = find((doc) => RegExp('mira', 'i').test(doc.name) && doc.age >= 10, getDocsInJSON(resources));
        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual(resourceExpected);
    });
    it('should return resource with specified id and 1 filter addresses.street=street3', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/secure/admin/mrq/resources/${resourceIdZak}`,
            query: {
                select: 'all',
                filter: JSON.stringify({ 'addresses.street': 'street3' }),
            },
        });
        const resourceExpected = find((doc) => doc.addresses.find((addr) => addr.street === 'street3'), getDocsInJSON(resources));
        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual(resourceExpected);
    });
    it('should return resource with specified id and 1 filter noField=null (i.e. all)', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/secure/admin/mrq/resources/${resourceId}`,
            query: {
                select: 'all',
                filter: JSON.stringify({ noField: null }),
            },
        });
        const resourceExpected = find((doc) => !doc.noField, getDocsInJSON(resources));
        delete resourceExpected?.auth?.password;
        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual(resourceExpected);
    });
    //#endregion filter
    it('should return resource with specified id and selected fields name,age', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/secure/admin/mrq/resources/${resourceId}`,
            query: {
                select: 'name,age',
            },
        });
        const resourceExpected = pipe(find({ _id: resourceId.toString() }), pick(['_id', 'name', 'age']))(getDocsInJSON(resources));
        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual(resourceExpected);
    });
    it('should return resource with specified id and selected fields name, age', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/secure/admin/mrq/resources/${resourceId}`,
            query: {
                select: 'name, age',
            },
        });
        const resourceExpected = pipe(find({ _id: resourceId.toString() }), pick(['_id', 'name', 'age']))(getDocsInJSON(resources));
        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual(resourceExpected);
    });
    it('should return resource with specified id and selected fields name, age, addresses and selected static method firstCity ', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/secure/admin/mrq/resources/${resourceId}`,
            query: {
                select: 'name, age, addresses, firstCity',
            },
        });
        const resourceExpected = pipe(find({ _id: resourceId.toString() }), pick(['_id', 'name', 'age', 'addresses']))(getDocsInJSON(resources));
        resourceExpected['firstCity'] = resourceExpected.addresses.find((address) => address.flags?.is_a_city)?.city;
        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual(resourceExpected);
    });
    it('should return resource with specified id, name=Zakariyya and populated path father (using string)', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/secure/admin/mrq/resources/${resourceIdZak}`,
            query: {
                select: 'all',
                populate: 'father',
                filter: JSON.stringify({ name: 'Zakariyya' }),
            },
        });
        const resourcesJSON = getDocsInJSON(resources);
        const resourceExpected = find({ name: 'Zakariyya' }, resourcesJSON);
        const father = find({ _id: resourceExpected.father }, resourcesJSON);
        delete father.auth.password;
        resourceExpected.father = father;
        expect(response.statusCode).toBe(200);
        expect(response.json()).toMatchObject(resourceExpected);
    });
    it('should return resource with specified id, name=Zakariyya and populated path father (using object with path, match, select)', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/secure/admin/mrq/resources/${resourceIdZak}`,
            query: {
                select: 'all',
                populate: JSON.stringify({
                    path: 'father',
                    match: { age: { $gte: 28 } },
                }),
                filter: JSON.stringify({ name: 'Zakariyya' }),
            },
        });
        const resourcesJSON = getDocsInJSON(resources);
        const resourceExpected = find({ name: 'Zakariyya' }, resourcesJSON);
        const father = pipe(find({ _id: resourceExpected.father }), pick('name'))(resourcesJSON);
        resourceExpected.father = father;
        expect(response.json()).toMatchObject(resourceExpected);
    });
    it('should return resource with name=Zakariyya and populated paths father and mother (using array of objects with path, match, select)', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/secure/admin/mrq/resources/${resourceIdZak}`,
            query: {
                select: 'all',
                populate: JSON.stringify([
                    {
                        path: 'father',
                        match: { age: { $gte: 28 } },
                        select: 'name',
                    },
                    {
                        path: 'mother',
                        match: { age: { $gte: 24 } },
                        select: 'name',
                    },
                ]),
                filter: JSON.stringify({ name: 'Zakariyya' }),
            },
        });
        const resourcesJSON = getDocsInJSON(resources);
        const resourceExpected = find({ name: 'Zakariyya' }, resourcesJSON);
        const father = pipe(find({ _id: resourceExpected.father }), pick('name'))(resourcesJSON);
        resourceExpected.father = father;
        const mother = pipe(find({ _id: resourceExpected.mother }), pick('name'))(resourcesJSON);
        resourceExpected.mother = mother;
        expect(response.json()).toMatchObject(resourceExpected);
    });
});
