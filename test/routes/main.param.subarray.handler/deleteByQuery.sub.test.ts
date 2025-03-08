import { app } from '@test/setup/setup'
import { ObjectId } from 'bson'

const resourceId = ObjectId.createFromTime(1)

describe.sequential('/:id/subarray DELETE (deleteByQuery)', () => {
  it('should delete and return all non-deleted addresses of the resource when filter used', async () => {
    const resGet = await app.inject({
      method: 'GET',
      url: `/secure/admin/mrq/resources/${resourceId}/addresses`,
      query: {
        select: '_id',
      },
    })

    const $in = resGet
      .json()
      .map((doc: any) => doc._id)

    const resDel = await app.inject({
      method: 'DELETE',
      url: `/secure/admin/mrq/resources/${resourceId}/addresses`,
      query: {
        filter: JSON.stringify({ _id: { $in } }),
      },
    })

    expect(resDel.statusCode).toBe(200)
    expect(resDel.json()).toMatchObject([])
  })
})
