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
  it('responds with 400 and correct message if username is missing', async () => {
    const newUser = { password: 'testing123' } 

    const response = await request(server)
      .post('/api/auth/register')
      .send(newUser)
  
    expect(response.status).toEqual(400)
    expect(response.body).toEqual({ message: 'username and password required' })
  })
  it('responds with 400 and correct message if password is missing', async () => {
    const newUser = { username: 'ricky' } 

    const response = await request(server)
      .post('/api/auth/register')
      .send(newUser)
  
    expect(response.status).toEqual(400)
    expect(response.body).toEqual({ message: 'username and password required' })
  })
  it('responds with 400 & correct message if username already taken', async () => {
    const existingUser = { username: 'repeatUser', password: 'nothingNew' }

    await request(server)
      .post('/api/auth/register')
      .send(existingUser)

    const response = await request(server)
      .post('/api/auth/register')
      .send(existingUser)

    expect(response.status).toEqual(400)
    expect(response.body).toEqual({ message: 'username taken' })
  })
})

describe('[POST] /api/auth/login', () => {
  it('responds with 200 and correct message/token on proper login', async () => {
    const existingUser = { username: 'iWillBeBack', password: 'imBack' }

    await request(server) 
      .post('/api/auth/register')
      .send(existingUser)

    const response = await request(server)
      .post('/api/auth/login')
      .send(existingUser)

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('message', 'welcome, iWillBeBack')
    expect(response.body).toHaveProperty('token')
  })
})


