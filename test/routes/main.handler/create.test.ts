import { app } from '@test/setup/setup'
import { ObjectId } from 'bson'

describe('/ POST (create)', () => {
  it('should create and return document when object body used', async () => {
    const resource = {
      _id: ObjectId.createFromTime(4).toString(),
      name: 'Person Four',
      age: 100,
      addresses: [
        {
          _id: ObjectId.createFromTime(400).toString(),
          street: 'street4',
          city: 'City Four',
        },
      ],
    }

    const response = await app.inject({
      method: 'POST',
      url: '/secure/admin/mrq/resources',
      body: resource,
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(resource)
  })

  it('should create and return document when object body and session used', async () => {
    const resource = {
      _id: ObjectId.createFromTime(5).toString(),
      name: 'Person Five',
      age: 100,
      addresses: [
        {
          _id: ObjectId.createFromTime(500).toString(),
          street: 'street5',
          city: 'City Five',
        },
      ],
    }

    const response = await app.inject({
      method: 'POST',
      url: '/secure/admin/mrq/resources',
      body: resource,
      query: { useSession: 'true' },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(resource)
  })

  it('should create and return documents when array body used', async () => {
    const resources = [
      {
        _id: ObjectId.createFromTime(6).toString(),
        name: 'Person Six',
        age: 100,
        addresses: [
          {
            _id: ObjectId.createFromTime(600).toString(),
            street: 'street6',
            city: 'City Six',
          },
        ],
      },
      {
        _id: ObjectId.createFromTime(7).toString(),
        name: 'Person Seven',
        age: 100,
        addresses: [
          {
            _id: ObjectId.createFromTime(700).toString(),
            street: 'street7',
            city: 'City Seven',
          },
        ],
      },
    ]

    const response = await app.inject({
      method: 'POST',
      url: '/secure/admin/mrq/resources',
      body: resources,
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(resources)
  })

  it('should create and return documents when array body and session used', async () => {
    const resources = [
      {
        _id: ObjectId.createFromTime(8).toString(),
        name: 'Person Eight',
        age: 100,
        addresses: [
          {
            _id: ObjectId.createFromTime(800).toString(),
            street: 'street8',
            city: 'City Eight',
          },
        ],
      },
      {
        _id: ObjectId.createFromTime(9).toString(),
        name: 'Person Nine',
        age: 100,
        addresses: [
          {
            _id: ObjectId.createFromTime(900).toString(),
            street: 'street9',
            city: 'City Nine',
          },
        ],
      },
    ]

    const response = await app.inject({
      method: 'POST',
      url: '/secure/admin/mrq/resources',
      body: resources,
      query: { useSession: 'true' },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject(resources)
  })
})
