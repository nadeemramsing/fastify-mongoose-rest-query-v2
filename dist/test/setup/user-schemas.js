import { ALL_GET } from '@src/mrq.enum';
import { ResourceSchema } from './schemas/resource.schema';
export const userSchemas = {
    Resource: {
        endpointName: 'resources',
        schema: ResourceSchema,
        handlerAccesses: [...ALL_GET],
        getSubarray: () => { },
        subIdName: '',
        subPathName: '',
    },
};
