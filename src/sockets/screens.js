import { WebSocketServer } from 'ws';
import gameState from '../game/state.js';
import logger from '../utils/logger.js';

const screensWss = new WebSocketServer({ noServer: true });

const WS_EVENTS = {
  STATE_UPDATE: 'state_update',
  GAME_OVER: 'game_over',
};

const MESSAGE_TYPES = {
  START_GAME: 'start_game',
  HIT: 'hit',
  BALL_LOST: 'ball_lost',
};

const send = (client, type, state) => {
  if (client.readyState !== 1) return;
  client.send(
    JSON.stringify({
      type,
      state,
    })
  );
};

const broadcast = (type, state) => {
  screensWss.clients.forEach((client) => {
    send(client, type, state);
  });
};

const handleStartGame = (data) => {
  const state = gameState.startGame(data.playerName);

  logger.info(`[GAMEState] New Game started`);
  broadcast(WS_EVENTS.STATE_UPDATE, state);
};

const handleHit = (data) => {
  const state = gameState.registerHit(data.points);
  logger.info(`[GAMEState] Bumper hit new score is : ${state.score}`);
  broadcast(WS_EVENTS.STATE_UPDATE, state);
};

const handleBallLost = () => {
  const state = gameState.losesBall();

  logger.info(`[GAME] ball lost  / remaining : ${state.balls}`);

  broadcast(WS_EVENTS.STATE_UPDATE, state);
  if (gameState.isGameOver()) {
    logger.info('[GAME] Game Over');
    broadcast(WS_EVENTS.GAME_OVER, state);
  }
};

const MESSAGE_HANDLERS = {
  [MESSAGE_TYPES.START_GAME]: handleStartGame,
  [MESSAGE_TYPES.HIT]: handleHit,
  [MESSAGE_TYPES.BALL_LOST]: handleBallLost,
};

screensWss.on('connection', (ws) => {
  logger.info('[Screens] Client connecté');

  send(ws, WS_EVENTS.STATE_UPDATE, gameState.getState());

  ws.on('message', (msg) => {
    logger.info(msg.toString());

    try {
      const data = JSON.parse(msg.toString());
      if (!data?.type) {
        logger.warn('[Screens] Message sans type');
        return;
      }
      const handler = MESSAGE_HANDLERS[data.type];

      if (!handler) {
        logger.warn(`[Screens] Type de message inconnu : ${data.type}`);
        return;
      }

      handler(data);
    } catch (err) {
      logger.error('[Screens] Erreur traitement message :', err.message);
    }
  });

  ws.on('close', () => {
    logger.info('[Screens] Client déconnecté');
  });

  ws.on('error', (err) => {
    logger.error('[Screens] Erreur WS :', err.message);
  });
});

export default screensWss;
