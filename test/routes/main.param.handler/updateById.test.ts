import { app } from '@test/setup/setup'
import { ObjectId } from 'bson'
import { map, pick, pipe, take } from 'lodash/fp'

const resourceId = ObjectId.createFromTime(1)

describe.sequential('/:id PUT (updateById)', () => {
  it('should update and return updated document', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: `/secure/admin/mrq/resources/${resourceId}`,
      body: {
        name: "Nadeem's new name",
      },
    })

    const resource = {
      name: "Nadeem's new name",
    }

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(resource)
  })

  it('should update and return updated document with session', async () => {
    const resource = {
      name: "Nadeem's new name",
    }

    const response = await app.inject({
      method: 'PUT',
      url: `/secure/admin/mrq/resources/${resourceId}`,
      body: resource,
      query: {
        useSession: 'true',
      },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(resource)
  })

  it('should update and return updated document when an array field is updated', async () => {
    const resource = {
      addresses: [
        {
          street: 'Pitot Street',
          city: 'Souillac',
          aliases: [{ abbreviation: 'Gris Gris village' }],
        },
      ],
    }

    const response = await app.inject({
      method: 'PUT',
      url: `/secure/admin/mrq/resources/${resourceId}`,
      body: resource,
      query: {
        useSession: 'true',
      },
    })

    const body = {
      addresses: pipe(
        map((address) => pick(['street', 'city', 'aliases'], address)),
        take(1)
      )(response.json().addresses),
    }

    expect(response.statusCode).toBe(200)
    expect(body).toMatchObject(resource)
  })
})
