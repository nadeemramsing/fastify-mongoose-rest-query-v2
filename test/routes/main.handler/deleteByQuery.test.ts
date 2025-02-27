import { getDocsInJSON } from '@test/setup/fixtures/get-docs-in-json.method'
import { resources } from '@test/setup/fixtures/resources'
import { mongoInit } from '@test/setup/init/mongo.init'
import { app } from '@test/setup/setup'
import { filter } from 'lodash/fp'

describe('/ GET (deleteByQuery)', () => {
  it('should delete and return deletedCount of resources with 1 filter name=Nadeem', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: '/secure/admin/mrq/resources',
      query: {
        filter: JSON.stringify({ name: 'Nadeem' }),
      },
    })

    const resourcesExpected = filter(
      { name: 'Nadeem' },
      getDocsInJSON(resources)
    )

    expect(response.statusCode).toBe(200)
    expect(response.json().deletedCount).toBe(resourcesExpected.length)
  })

  it('should delete and return deletedCount of resources with 1 filter name=Nadeem with session', async () => {
    await mongoInit()

    const response = await app.inject({
      method: 'DELETE',
      url: '/secure/admin/mrq/resources',
      query: {
        filter: JSON.stringify({ name: 'Nadeem' }),
        useSession: 'true',
      },
    })

    const resourcesExpected = filter(
      { name: 'Nadeem' },
      getDocsInJSON(resources)
    )

    expect(response.statusCode).toBe(200)
    expect(response.json().deletedCount).toBe(resourcesExpected.length)
  })
})
