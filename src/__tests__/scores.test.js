import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import { app } from '../index.js'

// on mock supabase pour ne pas taper la vraie DB
vi.mock('../config/db.js', () => ({
  default: {
    from: () => ({
      select: () => ({
        order: () => ({
          limit: () => ({ data: [{ id: 1, player_name: 'Arthur', score: 42000 }], error: null })
        })
      }),
      insert: () => ({
        select: () => ({ data: [{ id: 2, player_name: 'Test', score: 1000 }], error: null })
      })
    })
  }
}))

describe('GET /api/scores', () => {
  it('retourne un tableau de scores', async () => {
    const res = await request(app).get('/api/scores')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})

describe('POST /api/scores', () => {
  it('crée un score et retourne 201', async () => {
    const res = await request(app)
      .post('/api/scores')
      .send({ player_name: 'Test', score: 1000 })
    expect(res.status).toBe(201)
    expect(res.body.player_name).toBe('Test')
  })

  it('retourne 400 si player_name manquant', async () => {
    const res = await request(app)
      .post('/api/scores')
      .send({ score: 1000 })
    expect(res.status).toBe(400)
  })
})