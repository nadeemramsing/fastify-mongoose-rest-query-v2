import { app } from '@test/setup/setup'
import { store } from '@src/mrq.config'

store.mongoPath = 'mongodb://localhost:27016/test-single-connection'

describe.sequential('Single Connection', () => {
  it('should return count of all resources with no filter', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/secure/admin/mrq/resources/count',
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().n).toBe(0)
  })
})
