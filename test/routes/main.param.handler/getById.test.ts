import { getDocsInJSON } from '@test/setup/fixtures/get-docs-in-json.method'
import { resources } from '@test/setup/fixtures/resources'
import { app } from '@test/setup/setup'
import { ObjectId } from 'bson'
import { find } from 'lodash/fp'

const resourceId = ObjectId.createFromTime(1)
const resourceIdZak = ObjectId.createFromTime(3)

describe.sequential('/:id GET (getById)', () => {
  //#region filter
  it('should return resource with specified id when no filter used', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/secure/admin/mrq/resources/${resourceId}`,
      query: {
        select: 'all',
      },
    })
    const resourceExpected = find({ name: 'Nadeem' }, getDocsInJSON(resources))

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual(resourceExpected)
  })
  //#endregion filter
})
