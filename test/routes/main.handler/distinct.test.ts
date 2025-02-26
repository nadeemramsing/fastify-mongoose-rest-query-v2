import { getDocsInJSON } from '@test/setup/fixtures/get-docs-in-json.method'
import { resources } from '@test/setup/fixtures/resources'
import { app } from '@test/setup/setup'
import { filter, flatten, pipe, pluck, uniq } from 'lodash/fp'

describe('/ GET (distinct)', () => {
  it('should return distinct names of all resources when no filter used', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources/distinct/name',
    })

    const resourcesExpected = getDocsInJSON(resources)

    const names = pipe(pluck('name'), uniq)(resourcesExpected)

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual(names)
  })

  it('should return distinct addresses.city of all resources when no filter used', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources/distinct/addresses.city',
    })

    const resourcesExpected = getDocsInJSON(resources)

    const names = pipe(
      pluck('addresses'),
      flatten,
      pluck('city'),
      uniq
    )(resourcesExpected)

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual(names)
  })

  it('should return distinct names of resources with 1 filter name=~a$', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources/distinct/name',
      query: {
        filter: JSON.stringify({ name: { $regex: 'a$' } }),
      },
    })

    const resourcesExpected = getDocsInJSON(resources)

    const names = pipe(
      pluck('name'),
      filter((doc) => doc.endsWith('a')),
      uniq
    )(resourcesExpected)

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual(names)
  })
})
