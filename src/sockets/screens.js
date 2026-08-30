import { WebSocket, WebSocketServer } from 'ws';
import gameState from '../game/state.js';
import logger from '../utils/logger.js';
import * as scoreService from '../services/score.service.js';

/**
 * ScreensWebSocketServer — gère les connexions WebSocket des écrans (playfield, backglass, dmd)
 */
class ScreensWebSocketServer {
  static MAX_PAYLOAD_BYTES = 4 * 1024;

  // Types de messages reçus depuis les écrans
  static MESSAGE_TYPES = {
    START_GAME: 'start_game',
    BUMPER_HIT: 'bumper_hit',
    SLINGSHOT_HIT: 'slingshot_hit',
    LIGHT_SENSOR: 'light_sensor',
    BALL_LOST: 'ball_lost',
    CARDS_DOWN: 'cards_down',
  };

  // Événements émis vers les écrans
  static WS_EVENTS = {
    STATE_UPDATE: 'state_update',
    GAME_OVER: 'game_over',
  };

  constructor() {
    this.wss = new WebSocketServer({
      noServer: true,
      maxPayload: ScreensWebSocketServer.MAX_PAYLOAD_BYTES,
    });
    this.messageHandlers = this.#buildMessageHandlers();
    this.#setupConnection();
  }

  // ── Handlers ────────────────────────────────────────────────────────────────

  #buildMessageHandlers() {
    return {
      [ScreensWebSocketServer.MESSAGE_TYPES.START_GAME]:
        this.#handleStartGame.bind(this),
      [ScreensWebSocketServer.MESSAGE_TYPES.BUMPER_HIT]:
        this.#handleBumperHit.bind(this),
      [ScreensWebSocketServer.MESSAGE_TYPES.SLINGSHOT_HIT]:
        this.#handleSlingshotHit.bind(this),
      [ScreensWebSocketServer.MESSAGE_TYPES.LIGHT_SENSOR]:
        this.#handleLightSensor.bind(this),
      [ScreensWebSocketServer.MESSAGE_TYPES.BALL_LOST]:
        this.#handleBallLost.bind(this),
      [ScreensWebSocketServer.MESSAGE_TYPES.CARDS_DOWN]:
        this.#handleCardsDown.bind(this),
    };
  }

  #handleStartGame(data) {
    try {
      const state = gameState.startGame(data.playerName, data.avatar);
      logger.info(
        { playerName: data.playerName, avatar: data.avatar },
        '[GAME] Nouvelle partie'
      );
      this.#broadcast(ScreensWebSocketServer.MESSAGE_TYPES.START_GAME, state);
    } catch (err) {
      logger.warn({ err }, '[GAME] startGame impossible');
    }
  }

  #handleBumperHit() {
    try {
      const state = gameState.registerBumperHit();
      logger.info({ score: state.score }, '[GAME] Bumper hit');
      this.#broadcast(ScreensWebSocketServer.MESSAGE_TYPES.BUMPER_HIT, state);
    } catch (err) {
      logger.warn({ err }, '[GAME] handleBumperHit impossible');
    }
  }

  #handleSlingshotHit() {
    try {
      const state = gameState.registerSlingshotHit();
      logger.info({ score: state.score }, '[GAME] Slingshot hit');
      this.#broadcast(
        ScreensWebSocketServer.MESSAGE_TYPES.SLINGSHOT_HIT,
        state
      );
    } catch (err) {
      logger.warn({ err }, '[GAME] handleSlingshotHit impossible');
    }
  }

  #handleLightSensor(data) {
    try {
      const state = gameState.registerLightSensor(data.sensorId);
      logger.info(
        { sensorId: data.sensorId, score: state.score },
        '[GAME] Capteur activé'
      );
      this.#broadcast(ScreensWebSocketServer.MESSAGE_TYPES.LIGHT_SENSOR, state);
    } catch (err) {
      logger.warn({ err }, '[GAME] handleLightSensor impossible');
    }
  }

  #handleCardsDown() {
    try {
      const state = gameState.registerAllCardsDown();
      logger.info(
        { score: state.score },
        '[GAME] Toutes les cartes retournées'
      );
      this.#broadcast(ScreensWebSocketServer.MESSAGE_TYPES.CARDS_DOWN, state);
    } catch (err) {
      logger.warn({ err }, '[GAME] handleCardsDown impossible');
    }
  }

  async #handleBallLost() {
    try {
      const state = gameState.losesBall();
      logger.info({ remaining: state.balls }, '[GAME] Balle perdue');

      if (gameState.isGameOver()) {
        logger.info(
          { player: state.currentPlayer, score: state.score },
          '[GAME] Game Over'
        );

        try {
          await scoreService.addNewScore(
            state.currentPlayer,
            state.score,
            state.avatar
          );
          logger.info('[GAME] Score sauvegardé en base');
        } catch (err) {
          logger.error({ err }, '[GAME] Erreur sauvegarde score');
        }

        this.#broadcast(ScreensWebSocketServer.WS_EVENTS.GAME_OVER, state);
      } else {
        this.#broadcast(ScreensWebSocketServer.MESSAGE_TYPES.BALL_LOST, state);
      }
    } catch (err) {
      logger.warn({ err }, '[GAME] handleBallLost impossible');
    }
  }

  // ── Transport ───────────────────────────────────────────────────────────────

  #send(client, type, state) {
    if (client.readyState !== WebSocket.OPEN) return;
    client.send(JSON.stringify({ type, state }));
  }

  #broadcast(type, state) {
    this.wss.clients.forEach((client) => this.#send(client, type, state));
  }

  // ── Connexion ───────────────────────────────────────────────────────────────

  #setupConnection() {
    this.wss.on('connection', (ws) => {
      this.#send(
        ws,
        ScreensWebSocketServer.WS_EVENTS.STATE_UPDATE,
        gameState.getState()
      );

      ws.on('message', async (msg) => {
        try {
          const data = JSON.parse(msg.toString());

          if (!data?.type) {
            logger.warn('[Screens] Message reçu sans type');
            return;
          }

          const handler = this.messageHandlers[data.type];
          if (!handler) {
            logger.warn(
              { type: data.type },
              '[Screens] Type de message inconnu'
            );
            return;
          }

          await handler(data);
        } catch (err) {
          logger.error({ err }, '[Screens] Erreur traitement message');
        }
      });

      ws.on('close', () => {
        logger.info('[Screens] Client déconnecté');
      });

      ws.on('error', (err) => {
        logger.error({ err }, '[Screens] Erreur WS');
      });
    });
  }

  getServer() {
    return this.wss;
  }
}

const screensWss = new ScreensWebSocketServer();
export const wss = screensWss.wss;
export default screensWss.getServer();
