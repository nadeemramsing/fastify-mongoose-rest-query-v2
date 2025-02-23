import { buildApp } from '@test/setup/app'
import { FastifyInstance } from 'fastify'

describe('GET /health HTTP', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildApp({ logger: false })
  })

  afterAll(async () => {
    await app.close()
  })

  it('GET /health returns status 200', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/health',
    })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).status).toBe('ok')
  })
})
