import { app } from '@test/setup/setup'
import { isValidObjectId } from 'mongoose'

describe('/ POST (create > Error handling)', () => {
  it('should create and return 1 document with _id only when empty object body used', async () => {
    const resource = {}

    const response = await app.inject({
      method: 'POST',
      url: '/secure/admin/mrq/resources',
      body: resource,
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(resource)
    expect(isValidObjectId(response.json()._id)).toBeTruthy()
  })

  it('should create and return 1 document with _id only when empty object body and session used', async () => {
    const resource = {}

    const response = await app.inject({
      method: 'POST',
      url: '/secure/admin/mrq/resources',
      body: resource,
      query: { useSession: 'true' },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(resource)
    expect(isValidObjectId(response.json()._id)).toBeTruthy()
  })

  it('should return [] when empty array body used', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/secure/admin/mrq/resources',
      body: [],
    })

    expect(response.statusCode).toBe(404)
    expect(response.json().message).toMatch(
      /^invalid_body: no object found in array/
    )
  })
})
