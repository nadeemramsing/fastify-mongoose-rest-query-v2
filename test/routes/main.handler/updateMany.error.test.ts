import { ObjectId } from 'bson'
import { app } from '@test/setup/setup'
import { filter } from 'lodash/fp'

describe('/ PUT (updateMany > Error handling)', () => {
  it('should return "EMPTY_BODY" error when empty array used', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/secure/admin/mrq/resources',
      body: [],
    })

    expect(response.statusCode).toBe(422)
    expect(response.json().message).toMatch(
      /^EMPTY_BODY: body should contain at least one object/
    )
  })

  it('should return "INVALID_BODY" error when array with 1 empty object used', async () => {
    const resources = [{}]

    const response = await app.inject({
      method: 'PUT',
      url: '/secure/admin/mrq/resources',
      body: resources,
    })

    expect(response.statusCode).toBe(422)
    expect(response.json().message).toMatch(
      /^INVALID_BODY: body should contain at least one object with _id/
    )
  })

  it('should return "INVALID_BODY" error when object used', async () => {
    const resources = {}

    const response = await app.inject({
      method: 'PUT',
      url: '/secure/admin/mrq/resources',
      body: resources,
    })

    expect(response.statusCode).toBe(422)
    expect(response.json().message).toMatch(
      /^INVALID_BODY: body should be an array/
    )
  })

  it('should update 1 object with _id and ignore 1 object without _id ', async () => {
    const resources = [
      {},
      {
        _id: ObjectId.createFromTime(1).toString(),
        name: `Nadeem's new name`,
      },
    ]

    const response = await app.inject({
      method: 'PUT',
      url: '/secure/admin/mrq/resources',
      body: resources,
    })

    const resourcesExpected = filter((doc) => doc._id, resources)

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(resourcesExpected)
  })
})
