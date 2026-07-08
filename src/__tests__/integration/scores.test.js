import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../../index.js';

/**
 * Tests d'intégration — route HTTP /api/scores
 */

vi.mock('../../config/db.js', () => ({
  default: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          limit: vi.fn(() => ({
            data: [
              { id: 1, player_name: 'Arthur', score: 42000, avatar: 'cuphead' },
              { id: 2, player_name: 'Bob', score: 18000, avatar: 'mugman' },
            ],
            error: null,
          })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          data: [
            { id: 3, player_name: 'Test', score: 1000, avatar: 'cuphead' },
          ],
          error: null,
        })),
      })),
    })),
  },
}));

describe('GET /api/scores/leaderboard', () => {
  it('retourne 200 avec un tableau de scores', async () => {
    const res = await request(app).get('/api/scores/leaderboard');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('retourne les bons champs sur chaque score', async () => {
    const res = await request(app).get('/api/scores/leaderboard');
    const score = res.body.data[0];
    expect(score).toHaveProperty('player_name');
    expect(score).toHaveProperty('score');
    expect(score).toHaveProperty('avatar');
  });

  it('retourne les scores dans le bon ordre décroissant', async () => {
    const res = await request(app).get('/api/scores/leaderboard');
    const scores = res.body.data.map((s) => s.score);
    expect(scores[0]).toBeGreaterThanOrEqual(scores[1]);
  });

  it('retourne 500 avec status "error" si supabase fail', async () => {
    const { default: supabase } = await import('../../config/db.js');
    supabase.from.mockReturnValueOnce({
      select: () => ({
        order: () => ({
          limit: () => ({
            data: null,
            error: { message: 'DB connection failed' },
          }),
        }),
      }),
    });

    const res = await request(app).get('/api/scores/leaderboard');
    expect(res.status).toBe(500);

    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('DB connection failed');
  });
});

describe('GET /', () => {
  it('retourne le status du serveur', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status');
  });
});

describe('Route inconnue', () => {
  it('retourne 404 avec status "fail" sur une route inexistante', async () => {
    const res = await request(app).get('/api/inexistant');
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('fail');
  });
});
