import { getDocsInJSON } from '@test/setup/fixtures/get-docs-in-json.method'
import { resources } from '@test/setup/fixtures/resources'
import { app } from '@test/setup/setup'
import { ObjectId } from 'bson'
import { find, pick, pipe } from 'lodash/fp'

const resourceId = ObjectId.createFromTime(1)
const addressId = ObjectId.createFromTime(100)

describe.sequential('/:id/subarray/:subId GET (getById)', () => {
  it('should return address of the resource with specified id', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/secure/admin/mrq/resources/${resourceId}/addresses/${addressId}`,
      query: { select: 'all' },
    })

    const resource: any = find(
      { _id: resourceId.toString() },
      getDocsInJSON(resources)
    )

    const address = find({ _id: addressId.toString() }, resource.addresses)

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(address)
  })

  it('should return address of the resource with specified id and selected fields', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/secure/admin/mrq/resources/${resourceId}/addresses/${addressId}`,
      query: { select: 'city, street, flags.is_a_city' },
    })

    const resource: any = find(
      { _id: resourceId.toString() },
      getDocsInJSON(resources)
    )

    console.log({ resource }, resource.addresses, addressId.toString())

    const address = pipe(
      find({ _id: addressId.toString() }),
      pick(['city', 'street', 'flags.is_a_city'])
    )(resource.addresses)

    console.log({ address, response })

    expect(response.json()).toMatchObject(address)
  })
})
