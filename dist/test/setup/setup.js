import { buildApp } from '@test/setup/app';
import { mongoInit } from './init/mongo.init';
let app;
const uri = 'mongodb://localhost:27016/test';
beforeAll(async () => {
    await mongoInit(uri);
    app = await buildApp({}, uri);
});
afterAll(async () => {
    await app.close();
});
export { app };
