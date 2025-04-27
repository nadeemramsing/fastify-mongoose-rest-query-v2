import mongoose from 'mongoose';
import { resources } from '@test/setup/fixtures/resources';
import { ResourceSchema } from '@test/setup/schemas';
export const mongoInit = async (uri = 'mongodb://localhost:27016/test') => {
    if (mongoose.connection.readyState !== 1)
        await mongoose.connect(uri);
    // mongoose.set('debug', true);
    const Resource = mongoose.model('Resource', ResourceSchema);
    const r1 = await Promise.allSettled([Resource.deleteMany()]);
    const r2 = await Promise.allSettled([
        ...resources.map((doc) => new Resource(doc).save()),
    ]);
};
