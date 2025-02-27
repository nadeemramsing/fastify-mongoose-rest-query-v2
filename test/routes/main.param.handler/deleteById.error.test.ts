import { app } from '@test/setup/setup'
import { ObjectId } from 'bson'

const resourceId = ObjectId.createFromTime(12345)

describe.sequential('/:id DELETE (deleteById > Error handling)', () => {
  it('should return "DOCUMENT_NOT_FOUND" error when a non-existing id used', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: `/secure/admin/mrq/resources/${resourceId}`,
    })

    expect(response.statusCode).toBe(404)
    expect(response.json().message).toMatch(/^DOCUMENT_NOT_FOUND/)
  })
})
