import { ALL_GET, ALL_POST, ALL_PUT, ALL_DELETE } from '@src/mrq.enum';
import { ResourceSchema } from './schemas/resource.schema';
export const adminSchemas = {
    Resource: {
        endpointName: 'resources',
        schema: ResourceSchema,
        handlerAccesses: [...ALL_GET, ...ALL_POST, ...ALL_PUT, ...ALL_DELETE],
        getSubarray: () => { },
        subIdName: '',
        subPathName: ''
    },
};
