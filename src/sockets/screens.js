import { WebSocketServer } from 'ws';
import gameState from '../game/state.js';
import logger from '../utils/logger.js';
import * as scoreService from '../services/score.service.js';

class ScreensWebSocketServer {
  static WS_EVENTS = {
    STATE_UPDATE: 'state_update',
    GAME_OVER: 'game_over',
  };

  static MESSAGE_TYPES = {
    START_GAME: 'start_game',
    BUMPER_HIT: 'bumper_hit',
    SLINGSHOT_HIT: 'slingshot_hit',
    LIGHT_SENSOR: 'light_sensor',
    BALL_LOST: 'ball_lost',
    CARD_HIT: 'card_hit',
    ALLCARDSDOWN: 'all_cards_down',
  };

  constructor() {
    this.wss = new WebSocketServer({ noServer: true });
    this.setupMessageHandlers();
    this.setupConnection();
  }

  setupMessageHandlers() {
    this.messageHandlers = {
      [ScreensWebSocketServer.MESSAGE_TYPES.START_GAME]:
        this.handleStartGame.bind(this),
      [ScreensWebSocketServer.MESSAGE_TYPES.BUMPER_HIT]:
        this.handleBumperHit.bind(this),
      [ScreensWebSocketServer.MESSAGE_TYPES.SLINGSHOT_HIT]:
        this.handleSlingshotHit.bind(this),
      [ScreensWebSocketServer.MESSAGE_TYPES.LIGHT_SENSOR]:
        this.handleLightSensor.bind(this),
      [ScreensWebSocketServer.MESSAGE_TYPES.BALL_LOST]:
        this.handleBallLost.bind(this),
    };
  }

  send(client, type, state) {
    if (client.readyState !== 1) return;
    client.send(
      JSON.stringify({
        type,
        state,
      })
    );
  }

  broadcast(type, state) {
    this.wss.clients.forEach((client) => {
      this.send(client, type, state);
    });
  }

  handleStartGame(data) {
    const state = gameState.startGame(data.playerName);
    logger.info(`[GAMEState] New Game started`);
    this.broadcast(ScreensWebSocketServer.WS_EVENTS.STATE_UPDATE, state);
  }

  handleBumperHit(data) {
    const state = gameState.registerBumperHit(data.bumperId);
    logger.info(`[GAME] Bumper  hit - State: ${JSON.stringify(state)}`);
    this.broadcast(ScreensWebSocketServer.WS_EVENTS.STATE_UPDATE, state);
  }

  handleCardHit(data) {
    const state = gameState.registerCardHit();
    logger.info(`carte touchée : state ${JSON.stringify(state)} `);
    this.broadcast(ScreensWebSocketServer.WS_EVENTS.STATE_UPDATE, state);
  }

  handleCardsDown(data) {
    const state = gameState.registerAllCardsDown(data.times);
    logger.info(`toute les cartes tombées : state ${JSON.stringify(state)} `);
    this.broadcast(ScreensWebSocketServer.WS_EVENTS.STATE_UPDATE, state);
  }

  handleSlingshotHit(data) {
    const state = gameState.registerSlingshotHit(data.slingshotId);
    logger.info(`[GAME] Slingshot hit - Score: ${state.score}`);
    this.broadcast(ScreensWebSocketServer.WS_EVENTS.STATE_UPDATE, state);
  }

  handleLightSensor(data) {
    const state = gameState.registerLightSensor(data.sensorId);
    logger.info(
      `[GAME] light sensor activated State: ${JSON.stringify(state)} `
    );
    this.broadcast(ScreensWebSocketServer.WS_EVENTS.STATE_UPDATE, state);
  }

  async handleBallLost() {
    const state = gameState.losesBall();
    logger.info(`[GAME] ball lost / remaining : ${state.balls}`);
    this.broadcast(ScreensWebSocketServer.WS_EVENTS.STATE_UPDATE, state);

    if (gameState.isGameOver()) {
      logger.info('[GAME] Game Over');
      try {
        await scoreService.addNewScore(
          state.currentPlayer,
          state.score,
          state.avatar
        );
        logger.info(
          `[GAME] Score sauvegardé : ${state.currentPlayer} - ${state.score}`
        );
      } catch (err) {
        logger.error('[GAME] Erreur sauvegarde score :', err.message);
      }
      this.broadcast(ScreensWebSocketServer.WS_EVENTS.GAME_OVER, state);
    }
  }

  setupConnection() {
    this.wss.on('connection', (ws) => {
      this.send(
        ws,
        ScreensWebSocketServer.WS_EVENTS.STATE_UPDATE,
        gameState.getState()
      );

      ws.on('message', (msg) => {
        try {
          const data = JSON.parse(msg.toString());
          if (!data?.type) {
            logger.warn('[Screens] Message sans type');
            return;
          }

          const handler = this.messageHandlers[data.type];
          if (!handler) {
            logger.warn(`[Screens] Type de message inconnu : ${data.type}`);
            return;
          }

          handler(data);
        } catch (err) {
          logger.error('[Screens] Erreur traitement message :', err.message);
        }
      });

      ws.on('close', () => {});

      ws.on('error', (err) => {
        logger.error('[Screens] Erreur WS :', err.message);
      });
    });
  }

  getServer() {
    return this.wss;
  }
}

const screensWss = new ScreensWebSocketServer();
export default screensWss.getServer();
