import { app } from '@test/setup/setup'
import { resources } from '@test/setup/fixtures/resources'
import { getDocsInJSON } from '@test/setup/fixtures/get-docs-in-json.method'
import {
  drop,
  filter,
  find,
  map,
  orderBy,
  pick,
  pipe,
  take,
  forEach,
} from 'lodash/fp'
import { TypeResource } from '@test/setup/schemas/resource.schema'

describe.sequential('/ GET (getByQuery)', () => {
  //#region filter
  it('should return all resources with no filter', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources',
      query: {
        select: 'all',
      },
    })

    const resourcesExpected = (getDocsInJSON(resources) as TypeResource[]).map(
      (resource) => {
        delete resource.auth?.password
        return resource
      }
    )

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

    const resourcesExpected = pipe(
      filter({ name: 'Nadeem' }),
      forEach<TypeResource>((resource) => {
        delete resource.auth?.password
      })
    )(getDocsInJSON(resources))

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(resourcesExpected)
  })

  it('should return resources with 2 filters name=~mira&age>=10', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources',
      query: {
        select: 'all',
        filter: JSON.stringify({ name: { $regex: 'mira' }, age: { $gte: 10 } }),
      },
    })

    const resourcesExpected = pipe(
      filter((doc: any) => RegExp('mira', 'i').test(doc.name) && doc.age >= 10),
      forEach<TypeResource>((resource) => {
        delete resource.auth?.password
      })
    )(getDocsInJSON(resources))

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(resourcesExpected)
  })

  it('should return resources with 1 filter addresses.street=street3', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources',
      query: {
        select: 'all',
        filter: JSON.stringify({ 'addresses.street': 'street3' }),
      },
    })

    const resourcesExpected = pipe(
      filter((doc: any) =>
        doc.addresses.find((addr: any) => addr.street === 'street3')
      ),
      forEach<TypeResource>((resource) => {
        delete resource.auth?.password
      })
    )(getDocsInJSON(resources))

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(resourcesExpected)
  })

  it('should return resources with 1 filter noField=null (i.e. all)', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources',
      query: {
        select: 'all',
        filter: JSON.stringify({ noField: null }),
      },
    })

    const resourcesExpected = pipe(
      filter((doc: any) => !doc.noField),
      forEach<TypeResource>((resource) => {
        delete resource.auth?.password
      })
    )(getDocsInJSON(resources))

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(resourcesExpected)
  })
  //#endregion filter

  //#region select
  it('should return all resources with selected fields name,age', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources',
      query: {
        select: 'name,age',
      },
    })

    const resourcesExpected = map(
      pick(['_id', 'name', 'age']),
      getDocsInJSON(resources)
    )

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(resourcesExpected)
  })

  it('should return all resources with selected fields name, age', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources',
      query: {
        select: 'name, age',
      },
    })

    const resourcesExpected = map(
      pick(['_id', 'name', 'age']),
      getDocsInJSON(resources)
    )

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(resourcesExpected)
  })

  it('should return all resources with selected fields name, age, addresses and selected static method firstCity', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources',
      query: {
        select: 'name, age, addresses, firstCity',
      },
    })

    const resourcesExpected = map(
      pick(['_id', 'name', 'age', 'addresses']),
      getDocsInJSON(resources)
    )

    resourcesExpected.forEach((doc: any) => {
      const firstCity = doc.addresses.find(
        (address: any) => address.flags?.is_a_city
      )?.city

      if (firstCity) doc.firstCity = firstCity
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(resourcesExpected)
  })
  //#endregion select

  //#region sort
  it('should return all resources sorted by age', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources',
      query: {
        select: 'all',
        sort: 'age',
      },
    })

    const resourcesExpected = pipe(
      orderBy('age', 'asc'),
      forEach<TypeResource>((resource) => {
        delete resource.auth?.password
      })
    )(getDocsInJSON(resources))

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(resourcesExpected)
  })

  it('should return all resources sorted by -name and ignoring string case', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources',
      query: {
        select: 'all',
        sort: '-name',
      },
    })

    const resourcesExpected = (getDocsInJSON(resources) as any[])
      .map((resource: any) => {
        delete resource.auth?.password
        return resource
      })
      .sort((a, b) => b.name.localeCompare(a.name))

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(resourcesExpected)
  })

  it('should return all resources sorted by name and ignoring string case', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources',
      query: {
        select: 'all',
        sort: 'name',
      },
    })

    const resourcesExpected = (getDocsInJSON(resources) as any[])
      .map((resource: any) => {
        delete resource.auth?.password
        return resource
      })
      .sort((a, b) => a.name.localeCompare(b.name))

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(resourcesExpected)
  })
  //#endregion sort

  //#region skip
  it('should return resources after the 2 first ones with skip 2', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources',
      query: {
        select: 'all',
        skip: '2',
      },
    })

    const resourcesExpected = drop(2, getDocsInJSON(resources))

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(resourcesExpected)
  })
  //#endregion skip

  //#region limit
  it('should return 2 first resources with limit 2', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources',
      query: {
        select: 'all',
        limit: '2',
      },
    })

    const resourcesExpected = pipe(
      take(2),
      forEach<TypeResource>((resource) => {
        delete resource.auth?.password
      })
    )(getDocsInJSON(resources))

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(resourcesExpected)
  })
  //#endregion limit

  //#region populate
  it('should return resource with name=Zakariyya and populated path father (using string)', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources',
      query: {
        select: 'all',
        populate: 'father',
        filter: JSON.stringify({ name: 'Zakariyya' }),
      },
    })

    const resourcesJSON = getDocsInJSON(resources)

    const resourceExpected: any = find({ name: 'Zakariyya' }, resourcesJSON)

    const father: any = find({ _id: resourceExpected.father }, resourcesJSON)

    delete father.auth.password

    resourceExpected.father = father

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject([resourceExpected])
  })

  it('should return resource with name=Zakariyya and populated path father (using object with path, match, select)', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources',
      query: {
        select: 'all',
        populate: JSON.stringify({
          path: 'father',
          match: { age: { $gte: 28 } },
          select: 'name',
        }),
        filter: JSON.stringify({ name: 'Zakariyya' }),
      },
    })

    const resourcesJSON = getDocsInJSON(resources)

    const resourceExpected: any = find({ name: 'Zakariyya' }, resourcesJSON)

    const father = pipe(
      find({ _id: resourceExpected.father }),
      pick('name')
    )(resourcesJSON)

    resourceExpected.father = father

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject([resourceExpected])
  })

  it('should return resource with name=Zakariyya and populated paths father and mother (using array of objects with path, match, select)', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources',
      query: {
        select: 'all',
        populate: JSON.stringify([
          {
            path: 'father',
            match: { age: { $gte: 28 } },
            select: 'name',
          },
          {
            path: 'mother',
            match: { age: { $gte: 24 } },
            select: 'name',
          },
        ]),
        filter: JSON.stringify({ name: 'Zakariyya' }),
      },
    })

    const resourcesJSON = getDocsInJSON(resources)

    const resourceExpected: any = find({ name: 'Zakariyya' }, resourcesJSON)

    const father = pipe(
      find({ _id: resourceExpected.father }),
      pick('name')
    )(resourcesJSON)

    resourceExpected.father = father

    const mother = pipe(
      find({ _id: resourceExpected.mother }),
      pick('name')
    )(resourcesJSON)

    resourceExpected.mother = mother

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject([resourceExpected])
  })
  //#endregion populate
})
