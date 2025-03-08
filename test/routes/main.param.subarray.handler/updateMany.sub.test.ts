import { app } from '@test/setup/setup'
import { ObjectId } from 'bson'

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
})
