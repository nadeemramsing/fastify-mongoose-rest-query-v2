import { useSession } from '@src/utils/mongoose.utils'
import { getDocsInJSON } from '@test/setup/fixtures/get-docs-in-json.method'
import { resources } from '@test/setup/fixtures/resources'
import { app } from '@test/setup/setup'
import { ObjectId } from 'bson'
import { find } from 'lodash/fp'

const resourceId = ObjectId.createFromTime(1)

describe.sequential('/:id/subarray PUT (updateMany.sub)', () => {
  it('should update and return updated subitems', async () => {
    const addresses = [
      {
        _id: ObjectId.createFromTime(100).toString(),
        city: `Beau Bassin's new name 1`,
      },
    ]

    const response = await app.inject({
      method: 'PUT',
      url: `/secure/admin/mrq/resources/${resourceId}/addresses`,
      body: addresses,
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(addresses)
  })

  it('should update and return updated subitems with session', async () => {
    const addresses = [
      {
        _id: ObjectId.createFromTime(100).toString(),
        city: `Beau Bassin's new name 2`,
      },
    ]

    const response = await app.inject({
      method: 'PUT',
      url: `/secure/admin/mrq/resources/${resourceId}/addresses`,
      body: addresses,
      query: {
        useSession: 'true',
      },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(addresses)
  })

  it('should update and return updated subitems with returnAll option', async () => {
    const addresses = [
      {
        _id: ObjectId.createFromTime(100).toString(),
        city: `Beau Bassin's new name 3`,
      },
    ]

    const response = await app.inject({
      method: 'PUT',
      url: `/secure/admin/mrq/resources/${resourceId}/addresses`,
      body: addresses,
      query: {
        returnAll: 'true',
      },
    })

    const resource: any = find(
      { _id: resourceId.toString() },
      getDocsInJSON(resources)
    )

    resource.addresses = resource.addresses.map((address: any) => {
      const addressUpdated = addresses.find((addr) => addr._id === address._id)

      if (addressUpdated) return addressUpdated

      return address
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(addresses)
  })

  it('should update, return updated subitems and delete non-updated subitems when /overwrite path used', async () => {
    const addresses = [
      {
        _id: ObjectId.createFromTime(100).toString(),
        city: `Beau Bassin's new name 4`,
      },
    ]

    const response = await app.inject({
      method: 'PUT',
      url: `/secure/admin/mrq/resources/${resourceId}/addresses/overwrite`,
      body: addresses,
      query: {
        returnAll: 'true',
      },
    })

    const body = response.json()

    expect(response.statusCode).toBe(200)
    expect(body).toMatchObject(addresses)
    expect(body.length).toBe(addresses.length)
  })
})
