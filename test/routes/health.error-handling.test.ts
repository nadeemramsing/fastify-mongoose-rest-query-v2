import { app } from '@test/setup/setup'

describe('GET / HTTP', () => {
  it('GET / returns status 404', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/',
    })

    expect(response.statusCode).toBe(404)
  })
})
