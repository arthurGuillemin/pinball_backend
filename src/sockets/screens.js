import { WebSocketServer } from 'ws';
import gameState from '../game/state.js';
import logger from '../utils/logger.js';

const screensWss = new WebSocketServer({ noServer: true });

const broadcast = (type, state) => {
  const payload = JSON.stringify({ type, state });
  screensWss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
};

const MESSAGE_HANDLERS = {
  start_game: (data) => {
    const state = gameState.startGame(data.playerName);
    broadcast('state_update', state);
  },
  hit: (data) => {
    const state = gameState.registerHit(data.points);
    broadcast('state_update', state);
  },
  ball_lost: () => {
    const state = gameState.losesBall();
    broadcast('state_update', state);
    if (gameState.isGameOver()) {
      broadcast('game_over', state);
    }
  },
};

screensWss.on('connection', (ws) => {
  logger.info('[Screens] Client connecté');
  ws.send(
    JSON.stringify({ type: 'state_update', state: gameState.getState() })
  );

  ws.on('message', (msg) => {
    logger.info(gameState.getState());
    try {
      const data = JSON.parse(msg.toString());
      const handler = MESSAGE_HANDLERS[data.type];

      if (!handler) {
        logger.warn(`[Screens] Type de message inconnu : ${data.type}`);
        return;
      }

      handler(data);
    } catch (err) {
      logger.error('[Screens] Erreur parsing message :', err.message);
    }
  });

  ws.on('close', () => logger.info('[Screens] Client déconnecté'));
  ws.on('error', (err) => logger.error('[Screens] Erreur WS :', err.message));
});

export default screensWss;
