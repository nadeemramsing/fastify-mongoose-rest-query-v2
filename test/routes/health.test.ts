import { buildApp } from '../setup/app'
import { FastifyInstance } from 'fastify'
import { describe, it, before, after } from 'node:test'
import assert from 'assert'

describe('GET /health HTTP', () => {
  let app: FastifyInstance

  before(async () => {
    app = await buildApp({ logger: false })
  })

  after(async () => {
    await app.close()
  })

  it('GET /health returns status 200', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/health',
    })

    assert.strictEqual(response.statusCode, 200)
    assert.strictEqual(JSON.parse(response.payload).status, 'ok')
  })
})
