import { app } from '@test/setup/setup'

describe.sequential('GET /health HTTP', () => {
  it('GET /health returns status 200', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/health',
    })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).status).toBe('ok')
  })
})
