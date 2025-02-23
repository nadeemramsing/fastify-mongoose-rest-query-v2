import { FastifyInstance } from 'fastify'
import { buildApp } from '@test/setup/app'

let app: FastifyInstance

beforeAll(async () => {
  app = await buildApp()
})

afterAll(async () => {
  await app.close()
})

export { app }
