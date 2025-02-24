import { app } from '@test/setup/setup'
import { resources } from '@test/setup/fixtures/resources'
import { getDocsInJSON } from '@test/setup/fixtures/get-docs-in-json.method'

describe('/', () => {
  it('GET /health returns status 200', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/mrq/resources',
      query: {
        select: 'all',
      },
    })

    const resourcesExpected = getDocsInJSON(resources)

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(resourcesExpected)
  })
})
