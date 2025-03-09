import { getDocsInJSON } from '@test/setup/fixtures/get-docs-in-json.method'
import { resources } from '@test/setup/fixtures/resources'
import { app } from '@test/setup/setup'
import { ObjectId } from 'bson'
import { filter, find, pick, pipe } from 'lodash/fp'

const resourceId = ObjectId.createFromTime(1)
const addressId = ObjectId.createFromTime(100)

describe.sequential('/:id/subarray/:subId DELETE (deleteById)', () => {
  it('should delete address specified and return the other non-deleted addresses', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: `/secure/admin/mrq/resources/${resourceId}/addresses/${addressId}`,
    })

    const resource: any = find(
      { _id: resourceId.toString() },
      getDocsInJSON(resources)
    )

    const addressesNotDeleted = filter(
      (doc) => doc._id !== addressId.toString(),
      resource.addresses
    )

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(addressesNotDeleted)
  })
})
