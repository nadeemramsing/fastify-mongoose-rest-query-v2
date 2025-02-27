import { app } from '@test/setup/setup'
import { ObjectId } from 'bson'

const resourceId = ObjectId.createFromTime(1)

describe.sequential('/:id PUT (updateById)', () => {
  it('should update and return updated document', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: `/secure/admin/mrq/resources/${resourceId}`,
      body: {
        name: "Nadeem's new name",
      },
    })

    const resource = {
      name: "Nadeem's new name",
    }

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(resource)
  })
})
