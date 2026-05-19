import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';

// mock supabase
vi.mock('../config/db.js', () => ({
  default: {
    from: () => ({
      select: () => ({
        order: () => ({
          limit: () => ({
            data: [{ id: 1, player_name: 'Arthur', score: 42000 }],
            error: null,
          }),
        }),
      }),
      insert: () => ({
        select: () => ({
          data: [{ id: 2, player_name: 'Test', score: 1000 }],
          error: null,
        }),
      }),
    }),
  },
}));

describe('GET /api/scores/leaderboard', () => {
  it('retourne un tableau de scores', async () => {
    const res = await request(app).get('/api/scores/leaderboard');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toHaveProperty('score');
  });
});
