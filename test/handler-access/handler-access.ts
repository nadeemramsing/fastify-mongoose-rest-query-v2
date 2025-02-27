import { app } from '@test/setup/setup'
import { resources } from '@test/setup/fixtures/resources'
import { getDocsInJSON } from '@test/setup/fixtures/get-docs-in-json.method'
import { filter } from 'lodash/fp'

// TODO once we have post/put/delete handlers
describe.sequential('/ GET (getByQuery)', () => {
  it('should return all resources with no filter', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources',
      query: {
        select: 'all',
      },
    })

    const resourcesExpected = getDocsInJSON(resources)

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(resourcesExpected)
  })

  it('should return resources with 1 filter name=Nadeem', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources',
      query: {
        select: 'all',
        filter: JSON.stringify({ name: 'Nadeem' }),
      },
    })

    const resourcesExpected = filter(
      { name: 'Nadeem' },
      getDocsInJSON(resources)
    )

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(resourcesExpected)
  })
})
