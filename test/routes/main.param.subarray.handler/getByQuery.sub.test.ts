import { getDocsInJSON } from '@test/setup/fixtures/get-docs-in-json.method'
import { resources } from '@test/setup/fixtures/resources'
import { app } from '@test/setup/setup'
import { ObjectId } from 'bson'
import { find } from 'lodash/fp'

const resourceId = ObjectId.createFromTime(1)

describe.sequential('/:id/subarray GET (getByQuery.sub)', () => {
  it('should return all addresses of the resource with specified id', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/secure/admin/mrq/resources/${resourceId}/addresses`,
      query: {
        select: 'all',
      },
    })

    const resource: any = find(
      { _id: resourceId.toString() },
      getDocsInJSON(resources)
    )

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual(resource.addresses)
  })
})
