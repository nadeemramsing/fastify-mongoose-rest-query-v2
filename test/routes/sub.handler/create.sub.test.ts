import { getDocsInJSON } from '@test/setup/fixtures/get-docs-in-json.method'
import { resources } from '@test/setup/fixtures/resources'
import { mongoInit } from '@test/setup/init/mongo.init'
import { app } from '@test/setup/setup'
import { ObjectId } from 'bson'
import { find } from 'lodash/fp'

const resourceId = ObjectId.createFromTime(1)

describe.sequential('/:id/subarray POST (create.sub)', () => {
  it('should create and return created subitems', async () => {
    const addresses = [
      {
        city: 'City 1',
      },
    ]

    const response = await app.inject({
      method: 'POST',
      url: `/secure/admin/mrq/resources/${resourceId}/addresses`,
      body: addresses,
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(addresses)
  })

  it('should create and return created subitems when session used', async () => {
    const addresses = [
      {
        city: 'City 2.0',
      },
      {
        city: 'City 2.1',
      },
    ]

    const response = await app.inject({
      method: 'POST',
      url: `/secure/admin/mrq/resources/${resourceId}/addresses`,
      body: addresses,
      query: {
        useSession: 'true',
      },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(addresses)
  })

  it('should create and return all subitems when returnAll option used', async () => {
    await mongoInit()

    const addresses = [
      {
        city: 'City 3',
      },
      {
        city: 'City 4',
      },
    ]

    const response = await app.inject({
      method: 'POST',
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

    resource.addresses.push(...addresses)

    expect(response.json()).toMatchObject(resource.addresses)
  })
})
