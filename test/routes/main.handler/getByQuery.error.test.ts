import { app } from '@test/setup/setup'

describe('/ GET (getByQuery > Error handling)', () => {
  it('should return 405 on trying to select all without explicitly selecting all', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources',
      query: {},
    })

    expect(response.statusCode).toBe(405)
    expect(response.json().message).toMatch(
      /^IMPLICIT_SELECT_ALL_NOT_ALLOWED: use select=all query param/
    )
  })

  it('should return 404 on calling non-existing endpoint', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources/non-existing',
      query: { select: 'all' },
    })

    expect(response.statusCode).toBe(404)
    // TOOD: This will work once getById is implemented
    // expect(response.json().message).toMatch(
    //   /^Cast to ObjectId failed for value \"non-existing\" \(type string\) at path \"_id\" for model \"Resource\"/
    // )
  })

  it('should return 0 resource with 1 filter name=non-existing', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources',
      query: {
        select: 'all',
        filter: JSON.stringify({ name: 'non-existing' }),
      },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual([])
  })

  it('should return error when non-existing populate field is used', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources',
      query: {
        select: 'all',
        populate: 'non-existing',
        filter: JSON.stringify({ name: 'Zakariyya' }),
      },
    })

    expect(response.statusCode).toBe(500)
    expect(response.json().message).toMatch(
      /^Cannot populate path `non-existing` because it is not in your schema\. Set the `strictPopulate` option to false to override\.$/
    )
  })
})
