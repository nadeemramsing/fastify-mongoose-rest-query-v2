import { getSubHandler } from '../handler/sub.handler';
import { getChildarray } from '../utils/mongoose.utils';
import { countCharacter } from '../utils/misc.utils';
export const subRoute = (modelName, schemaOptions) => async (app) => {
    const { schema } = schemaOptions;
    for (const [subPathName, schemaInstance] of Object.entries(schema.obj)) {
        if (!Array.isArray(schemaInstance))
            continue;
        schemaOptions.subPathName += subPathName + ':';
        const subHandler = getSubHandler(modelName, schemaOptions);
        let prefix = `/${subPathName}`;
        app.get(prefix, subHandler.getByQuery);
        app.get(`${prefix}/count`, subHandler.count);
        app.get(`${prefix}/distinct/:path`, subHandler.distinct);
        app.post(prefix, subHandler.create);
        app.put(prefix, subHandler.updateMany);
        app.put(`${prefix}/overwrite`, subHandler.updateMany);
        app.delete(prefix, subHandler.deleteByQuery);
        prefix += `/:${schemaOptions.subIdName}`;
        app.get(prefix, subHandler.getById);
        app.put(prefix, subHandler.updateById);
        app.put(`${prefix}/overwrite`, subHandler.updateById);
        app.delete(prefix, subHandler.deleteById);
        const noOfColons = countCharacter(':', schemaOptions.subPathName);
        if (noOfColons > 2)
            continue;
        for (const childSchemaInstance of schemaInstance) {
            const childRoute = subRoute(modelName, {
                ...schemaOptions,
                schema: childSchemaInstance,
                getSubarray: getChildarray,
                subIdName: 'childId',
            });
            app.register(childRoute, { prefix });
        }
    }
};
