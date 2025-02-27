import { app } from '@test/setup/setup'
import { ObjectId } from 'bson'

const resourceId = ObjectId.createFromTime(1)

describe.sequential('/:id GET (getById > Error handling)', () => {
  it('should return "DOCUMENT_NOT_FOUND" error when non-existing field with a truthy value is used', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/secure/admin/mrq/resources/${resourceId}`,
      query: {
        select: 'all',
        filter: JSON.stringify({ noField: 'any_value' }),
      },
    })

    expect(response.statusCode).toBe(404)
    expect(response.json().message).toMatch(/^DOCUMENT_NOT_FOUND/)
  })

  it('should return "IMPLICIT_SELECT_ALL_NOT_ALLOWED" error when trying to select all without explicitly selecting all', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/secure/admin/mrq/resources/${resourceId}`,
    })

    expect(response.statusCode).toBe(405)
    expect(response.json().message).toMatch(
      /^IMPLICIT_SELECT_ALL_NOT_ALLOWED: use select=all query param/
    )
  })
})
