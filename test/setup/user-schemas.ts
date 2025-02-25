import { IRestOptions } from '@src/mrq.interfaces'
import { ALL_GET } from '@src/mrq.enum'
import { ResourceSchema } from './schemas/resource.schema'

export const userSchemas: IRestOptions['schemas'] = {
  Resource: {
    endpointName: 'resources',
    schema: ResourceSchema,
    handlerAccesses: [...ALL_GET],
  },
}
