import { getDocsInJSON } from '@test/setup/fixtures/get-docs-in-json.method'
import { resources } from '@test/setup/fixtures/resources'
import { app } from '@test/setup/setup'
import { ObjectId } from 'bson'
import { filter, find, isNil, pipe, pluck, reject, uniq } from 'lodash/fp'

const resourceId = ObjectId.createFromTime(1)

describe.sequential('/ GET (distinct)', () => {
  it('should return distinct "cities" of all addresses of resource with specified id when no filter used', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/secure/admin/mrq/resources/${resourceId}/addresses/distinct/city`,
    })

    const resource: any = find(
      { _id: resourceId.toString() },
      getDocsInJSON(resources)
    )

    const cities = pipe(pluck('city'), uniq)(resource.addresses)

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual(cities)
  })

  it('should return distinct nested path "flags.is_a_city" of all addresses of resource with specified id when no filter used', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/secure/admin/mrq/resources/${resourceId}/addresses/distinct/flags.is_a_city`,
    })

    const resource: any = find(
      { _id: resourceId.toString() },
      getDocsInJSON(resources)
    )

    const distinctValues = pipe(
      pluck('flags.is_a_city'),
      uniq,
      reject(isNil)
    )(resource.addresses)

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual(distinctValues)
  })

  it('should return distinct "cities" of all addresses with 1 filter city starting with "Beau"', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/secure/admin/mrq/resources/${resourceId}/addresses/distinct/city`,
      query: {
        filter: JSON.stringify({ city: { $regex: '^Beau' } }),
      },
    })

    const resource: any = find(
      { _id: resourceId.toString() },
      getDocsInJSON(resources)
    )

    const cities = pipe(
      filter((doc: any) => doc.city?.startsWith?.('Beau')),
      pluck('city'),
      uniq
    )(resource.addresses)

    expect(response.json()).toEqual(cities)
  })
})
