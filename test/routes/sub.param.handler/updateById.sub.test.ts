import { getDocsInJSON } from '@test/setup/fixtures/get-docs-in-json.method'
import { resources } from '@test/setup/fixtures/resources'
import { app } from '@test/setup/setup'
import { ObjectId } from 'bson'
import { find, pick, pipe } from 'lodash/fp'

const resourceId = ObjectId.createFromTime(1)
const addressId = ObjectId.createFromTime(100)

describe.sequential('/:id/subarray/:subId PUT (updateById)', () => {
  it('should update and return updated subitem', async () => {
    const address = {
      city: `Beau Bassin's new name 1`,
    }

    const response = await app.inject({
      method: 'PUT',
      url: `/secure/admin/mrq/resources/${resourceId}/addresses/${addressId}`,
      body: address,
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(address)
  })

  it('should update and return updated subitem when session used', async () => {
    const address = {
      city: `Beau Bassin's new name 2`,
    }

    const response = await app.inject({
      method: 'PUT',
      url: `/secure/admin/mrq/resources/${resourceId}/addresses/${addressId}`,
      body: address,
      query: {
        useSession: 'true',
      },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(address)
  })

  it('should update and return all subitems when returnAll option used', async () => {
    const addressToUpdate = {
      city: `Beau Bassin's new name 3`,
    }

    const response = await app.inject({
      method: 'PUT',
      url: `/secure/admin/mrq/resources/${resourceId}/addresses/${addressId}`,
      body: addressToUpdate,
      query: {
        returnAll: 'true',
      },
    })

    const resource: any = find(
      { _id: resourceId.toString() },
      getDocsInJSON(resources)
    )

    const address = find({ _id: addressId.toString() }, resource.addresses)

    Object.assign(address, addressToUpdate)

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(resource.addresses)
  })
})
