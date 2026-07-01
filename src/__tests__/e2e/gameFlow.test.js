import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { WebSocket } from 'ws';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createConnection } from 'net';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../../..');

const PORT = 3099;
const WS_URL = `ws://127.0.0.1:${PORT}/screens`;
let serverProcess;

function waitForPort(port, timeout = 12000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const tryConnect = () => {
      const socket = createConnection({ port, host: '127.0.0.1' });
      socket.once('connect', () => {
        socket.destroy();
        resolve();
      });
      socket.once('error', () => {
        socket.destroy();
        if (Date.now() - start > timeout) {
          reject(new Error(`Port ${port} not ready after ${timeout}ms`));
        } else {
          setTimeout(tryConnect, 200);
        }
      });
    };
    tryConnect();
  });
}

beforeAll(async () => {
  serverProcess = spawn(process.execPath, ['src/index.js'], {
    cwd: ROOT,
    env: { ...process.env, NODE_ENV: 'e2e', PORT: String(PORT) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  await waitForPort(PORT, 12000);
}, 15000);

afterAll(async () => {
  if (serverProcess && !serverProcess.killed) {
    serverProcess.kill('SIGTERM');
    await new Promise((resolve) => {
      serverProcess.once('exit', resolve);
      setTimeout(resolve, 3000);
    });
  }
}, 8000);

// ── Helpers ──────────────────────────────────────────────────────────────────

function connectClient() {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(WS_URL);
    ws.once('open', () => resolve(ws));
    ws.once('error', reject);
  });
}

function waitForMessage(ws, timeoutMs = 3000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`waitForMessage timeout after ${timeoutMs}ms`)),
      timeoutMs
    );
    ws.once('message', (raw) => {
      clearTimeout(timer);
      resolve(JSON.parse(raw.toString()));
    });
  });
}

function send(ws, type, payload = {}) {
  ws.send(JSON.stringify({ type, ...payload }));
}

function closeAndWait(ws) {
  return new Promise((resolve) => {
    if (ws.readyState === WebSocket.CLOSED) return resolve();
    ws.once('close', resolve);
    ws.close();
  });
}

async function resetServerState() {
  const res = await fetch(`http://127.0.0.1:${PORT}/__test/reset`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error(`Reset failed: ${res.status}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// CONNEXION
// ═══════════════════════════════════════════════════════════════════════════

describe('E2E — connexion WebSocket', () => {
  it("envoie l'état initial à la connexion", async () => {
    await resetServerState();
    const ws = await connectClient();
    const msg = await waitForMessage(ws);

    expect(msg.type).toBe('state_update');
    expect(msg.state.isRunning).toBe(false);
    expect(msg.state.score).toBe(0);
    expect(msg.state.balls).toBe(3);

    await closeAndWait(ws);
  });

  it('un nouveau client recup le state courant si une partie est en cours', async () => {
    await resetServerState();
    const ws1 = await connectClient();
    await waitForMessage(ws1);
    send(ws1, 'start_game', { playerName: 'Arthur', avatar: 'cuphead' });
    await waitForMessage(ws1);
    await closeAndWait(ws1);
    const ws2 = await connectClient();
    const msg = await waitForMessage(ws2);

    expect(msg.state.isRunning).toBe(true);
    expect(msg.state.currentPlayer).toBe('Arthur');

    await closeAndWait(ws2);
  });
});

// ═════════════════════════════════════════════════
// start_game
// ═══════════════════════════════════════════════════════════════════════════

describe('E2E — start_game', () => {
  it('démarre une partie et broadcast state_update', async () => {
    await resetServerState();
    const ws = await connectClient();
    await waitForMessage(ws);

    send(ws, 'start_game', { playerName: 'Arthur', avatar: 'cuphead' });
    const msg = await waitForMessage(ws);

    expect(msg.type).toBe('state_update');
    expect(msg.state.isRunning).toBe(true);
    expect(msg.state.currentPlayer).toBe('Arthur');
    expect(msg.state.avatar).toBe('cuphead');

    await closeAndWait(ws);
  });

  it('playerName trop long (> 20 caractères) est rejeté sans broadcast', async () => {
    await resetServerState();
    const ws = await connectClient();
    await waitForMessage(ws); // state initial

    const tooLong = 'A'.repeat(21);
    send(ws, 'start_game', { playerName: tooLong, avatar: 'cuphead' });

    // GameState.startGame throw → #handleStartGame catch et log un warn,
    // aucun state_update n'est broadcasté
    await expect(waitForMessage(ws, 400)).rejects.toThrow('timeout');

    await closeAndWait(ws);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// GAMEPLAY
// ═══════════════════════════════════════════════════════════════════════════

describe('E2E — gameplay', () => {
  it('bumper_hit incr le score de 100', async () => {
    await resetServerState();
    const ws = await connectClient();
    await waitForMessage(ws);
    send(ws, 'start_game', { playerName: 'Arthur' });
    await waitForMessage(ws);

    send(ws, 'bumper_hit');
    expect((await waitForMessage(ws)).state.score).toBe(100);
    await closeAndWait(ws);
  });

  it('slingshot_hit incr le score de 50', async () => {
    await resetServerState();
    const ws = await connectClient();
    await waitForMessage(ws);
    send(ws, 'start_game', { playerName: 'Arthur' });
    await waitForMessage(ws);

    send(ws, 'slingshot_hit');
    expect((await waitForMessage(ws)).state.score).toBe(50);
    await closeAndWait(ws);
  });

  it('light_sensor incr le score de 200', async () => {
    await resetServerState();
    const ws = await connectClient();
    await waitForMessage(ws);
    send(ws, 'start_game', { playerName: 'Arthur' });
    await waitForMessage(ws);

    send(ws, 'light_sensor', { sensorId: 'SENSOR_lane_right_1' });
    const msg = await waitForMessage(ws);
    expect(msg.state.score).toBe(200);
    expect(msg.state.lightsActivated).toContain('SENSOR_lane_right_1');
    await closeAndWait(ws);
  });

  it('light_sensor avec un sensorId inconnu est rejeté sans broadcast', async () => {
    await resetServerState();
    const ws = await connectClient();
    await waitForMessage(ws);
    send(ws, 'start_game', { playerName: 'Arthur' });
    await waitForMessage(ws);

    send(ws, 'light_sensor', { sensorId: 'sensr_bidon' });
    await expect(waitForMessage(ws, 400)).rejects.toThrow('timeout');

    await closeAndWait(ws);
  });

  it('cards_down incrémente le score de 4000', async () => {
    await resetServerState();
    const ws = await connectClient();
    await waitForMessage(ws);
    send(ws, 'start_game', { playerName: 'Arthur' });
    await waitForMessage(ws);

    send(ws, 'cards_down');
    expect((await waitForMessage(ws)).state.score).toBe(4000);
    await closeAndWait(ws);
  });
});

//═════════════════════════════════════════
// BALL LOST — GAME OVER
// ═══════════════════════════════════════════════════════════════════════════

describe('E2E — ball_lost et game_over', () => {
  it('ball_lost décrémente les balles', async () => {
    await resetServerState();
    const ws = await connectClient();
    await waitForMessage(ws);
    send(ws, 'start_game', { playerName: 'Arthur' });
    await waitForMessage(ws);

    send(ws, 'ball_lost');
    const msg = await waitForMessage(ws);
    expect(msg.type).toBe('state_update');
    expect(msg.state.balls).toBe(2);
    await closeAndWait(ws);
  });

  it('3 ball_lost déclenchent game_over', async () => {
    await resetServerState();
    const ws = await connectClient();
    await waitForMessage(ws);
    send(ws, 'start_game', { playerName: 'Arthur' });
    await waitForMessage(ws);

    send(ws, 'ball_lost');
    await waitForMessage(ws);
    send(ws, 'ball_lost');
    await waitForMessage(ws);
    send(ws, 'ball_lost');
    const msg = await waitForMessage(ws);

    expect(msg.type).toBe('game_over');
    expect(msg.state.balls).toBe(0);
    await closeAndWait(ws);
  });
});

//═════════════════════════════════════════
// MESSAGES INVALIDES
// ═══════════════════════════════════════════════════════════════════════════

describe('E2E — messages invalides', () => {
  it('message sans type est ignoré sans crash', async () => {
    await resetServerState();
    const ws = await connectClient();
    await waitForMessage(ws);
    ws.send('{"foo": "bar"}');
    await expect(waitForMessage(ws, 400)).rejects.toThrow('timeout');
    await closeAndWait(ws);
  });

  it('JSON malformé est ignoré sans crash', async () => {
    await resetServerState();
    const ws = await connectClient();
    await waitForMessage(ws);
    ws.send('not json {{{{');
    await expect(waitForMessage(ws, 400)).rejects.toThrow('timeout');
    await closeAndWait(ws);
  });

  it('un message dépassant maxPayload (4 Ko) ne casse pas le serveur', async () => {
    await resetServerState();
    const ws = await connectClient();
    await waitForMessage(ws);

    const oversized = JSON.stringify({
      type: 'bumper_hit',
      junk: 'x'.repeat(5000),
    });

    const outcome = new Promise((resolve) => {
      ws.once('close', () => resolve('closed'));
      ws.once('error', () => resolve('errored'));
      setTimeout(() => resolve('timeout'), 1000);
    });

    ws.send(oversized);
    const result = await outcome;
    expect(['closed', 'errored']).toContain(result);

    const ws2 = await connectClient();
    const msg = await waitForMessage(ws2);
    expect(msg.type).toBe('state_update');
    await closeAndWait(ws2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// ROUTES HTTP — 404 catch-all
// ═══════════════════════════════════════════════════════════════════════════

describe('E2E — routes HTTP inconnues', () => {
  it('retourne 404 JSON cohérent sur une route inexistante', async () => {
    const res = await fetch(`http://127.0.0.1:${PORT}/api/inexistant`);
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.status).toBe('fail');
    expect(body.message).toContain('introuvable');
  });
});
