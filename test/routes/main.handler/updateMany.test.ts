import { ObjectId } from 'bson'
import { app } from '@test/setup/setup'

describe.sequential('/ PUT (updateMany)', () => {
  it('should update and return updated documents', async () => {
    const resources = [
      {
        _id: ObjectId.createFromTime(1).toString(),
        name: `Nadeem's new name`,
      },
      {
        _id: ObjectId.createFromTime(2).toString(),
        name: `Samira's new name`,
      },
      {
        _id: ObjectId.createFromTime(3).toString(),
        name: `Zakariyya's new name`,
      },
    ]

    const response = await app.inject({
      method: 'PUT',
      url: '/secure/admin/mrq/resources',
      body: resources,
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(resources)
  })
})
