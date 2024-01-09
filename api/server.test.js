const request = require('supertest')
const server = require('./server.js')
const db = require('../data/dbConfig.js')

beforeAll(async () => {
  
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

it('correct env', () => {
  expect(process.env.NODE_ENV).toBe('testing')
})

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

describe('[POST] /api/auth/register', () => {
  it('responds with 201 created and correct username', async () => {
    const newUser = { username: 'dolly', password: '9to5' }

    const response = await request(server)
      .post('/api/auth/register')
      .send(newUser)

    expect(response.status).toEqual(201)

    expect(response.body.username).toEqual('dolly')
  })
})


