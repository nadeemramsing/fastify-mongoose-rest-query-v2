import { app } from '@test/setup/setup'
import { resources } from '@test/setup/fixtures/resources'
import { getDocsInJSON } from '@test/setup/fixtures/get-docs-in-json.method'
import { filter } from 'lodash/fp'

describe('/ GET (count)', () => {
  it('should return count of all resources with no filter', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources/count',
      query: {},
    })

    const resourcesExpected = getDocsInJSON(resources)

    expect(response.statusCode).toBe(200)
    expect(response.json().n).toBe(resourcesExpected.length)
  })

  it('should return count of resources with 1 filter name=Nadeem', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources/count',
      query: {
        filter: JSON.stringify({ name: 'Nadeem' }),
      },
    })

    const resourcesExpected = filter(
      { name: 'Nadeem' },
      getDocsInJSON(resources)
    )

    expect(response.statusCode).toBe(200)
    expect(response.json().n).toBe(resourcesExpected.length)
  })

  it('should return count of resources with 2 filters name=~mira&age>=10', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources/count',
      query: {
        filter: JSON.stringify({ name: { $regex: 'mira' }, age: { $gte: 10 } }),
      },
    })

    const resourcesExpected = filter(
      (doc: any) => RegExp('mira', 'i').test(doc.name) && doc.age >= 10,
      getDocsInJSON(resources)
    )

    expect(response.statusCode).toBe(200)
    expect(response.json().n).toBe(resourcesExpected.length)
  })

  it('should return count of resources with 1 filter addresses.street=street3', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources/count',
      query: {
        filter: JSON.stringify({ 'addresses.street': 'street3' }),
      },
    })

    const resourcesExpected = filter(
      (doc: any) =>
        doc.addresses.find((addr: any) => addr.street === 'street3'),
      getDocsInJSON(resources)
    )

    expect(response.statusCode).toBe(200)
    expect(response.json().n).toBe(resourcesExpected.length)
  })

  it('should return count of resources with 1 filter noField=null (i.e. all)', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources/count',
      query: {
        filter: JSON.stringify({ noField: null }),
      },
    })

    const resourcesExpected = filter(
      (doc) => !doc.noField,
      getDocsInJSON(resources)
    )

    expect(response.statusCode).toBe(200)
    expect(response.json().n).toBe(resourcesExpected.length)
  })

  it('should return count of resources with 1 filter noField=any_value (i.e. none)', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources/count',
      query: {
        filter: JSON.stringify({ noField: 'any_value' }),
      },
    })

    const resourcesExpected = filter(
      (doc) => doc.noField === 'any_value',
      getDocsInJSON(resources)
    )

    expect(response.statusCode).toBe(200)
    expect(response.json().n).toBe(resourcesExpected.length)
  })
})
