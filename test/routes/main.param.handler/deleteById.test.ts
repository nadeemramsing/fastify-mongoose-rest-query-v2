import { app } from '@test/setup/setup'
import { ObjectId } from 'bson'

const resourceId = ObjectId.createFromTime(1)

describe.sequential('/:id DELETE (deleteById)', () => {
  it('should delete and return deletedCount 1', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: `/secure/admin/mrq/resources/${resourceId}`,
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().deletedCount).toBe(1)
  })
})
