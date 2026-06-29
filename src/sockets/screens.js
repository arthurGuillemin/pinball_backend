import { WebSocket, WebSocketServer } from 'ws';
import gameState from '../game/state.js';
import logger from '../utils/logger.js';
import * as scoreService from '../services/score.service.js';

/**
 * ScreensWebSocketServer — gère les connexions WebSocket des écrans (playfield, backglass, dmd).
 *
 * Responsabilités :
 *  - Accepter les connexions WS sur /screens
 *  - Router les messages entrants vers les handlers métier
 *  - Broadcaster les mises à jour d'état à tous les écrans connectés
 *
 * Pattern : map statique MESSAGE_TYPES → handlers pour éviter les switch/case.
 * WS_EVENTS sépare explicitement les événements sortants des types entrants.
 */
class ScreensWebSocketServer {
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
    this.wss = new WebSocketServer({ noServer: true });
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
        `[GAME] Nouvelle partie — joueur: ${data.playerName}, avatar: ${data.avatar}`
      );
      this.#broadcast(ScreensWebSocketServer.WS_EVENTS.STATE_UPDATE, state);
    } catch (err) {
      logger.error('[GAME] startGame error :', err.message);
    }
  }

  #handleBumperHit() {
    const state = gameState.registerBumperHit();
    logger.info(`[GAME] Bumper hit — score: ${state.score}`);
    this.#broadcast(ScreensWebSocketServer.WS_EVENTS.STATE_UPDATE, state);
  }

  #handleSlingshotHit() {
    const state = gameState.registerSlingshotHit();
    logger.info(`[GAME] Slingshot hit — score: ${state.score}`);
    this.#broadcast(ScreensWebSocketServer.WS_EVENTS.STATE_UPDATE, state);
  }

  #handleLightSensor(data) {
    const state = gameState.registerLightSensor(data.sensorId);
    logger.info(
      `[GAME] Capteur activé: ${data.sensorId} — score: ${state.score}`
    );
    this.#broadcast(ScreensWebSocketServer.WS_EVENTS.STATE_UPDATE, state);
  }

  #handleCardsDown() {
    const state = gameState.registerAllCardsDown();
    logger.info(`[GAME] Toutes les cartes retournées — score: ${state.score}`);
    this.#broadcast(ScreensWebSocketServer.WS_EVENTS.STATE_UPDATE, state);
  }

  /**
   * Gère la perte d'une balle.
   * Si c'était la dernière balle, sauvegarde le score et broadcast GAME_OVER.
   * Sinon broadcast STATE_UPDATE uniquement — pas de double message au client.
   */
  async #handleBallLost() {
    const state = gameState.losesBall();
    logger.info(`[GAME] Balle perdue — restantes: ${state.balls}`);

    if (gameState.isGameOver()) {
      logger.info(
        `[GAME] Game Over — joueur: ${state.currentPlayer}, score: ${state.score}`
      );

      try {
        await scoreService.addNewScore(
          state.currentPlayer,
          state.score,
          state.avatar
        );
        logger.info('[GAME] Score sauvegardé en base');
      } catch (err) {
        // La sauvegarde échoue silencieusement côté BDD
        // mais le game over est quand même notifié aux écrans
        logger.error('[GAME] Erreur sauvegarde score :', err.message);
      }

      this.#broadcast(ScreensWebSocketServer.WS_EVENTS.GAME_OVER, state);
    } else {
      this.#broadcast(ScreensWebSocketServer.WS_EVENTS.STATE_UPDATE, state);
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
      // Envoie l'état courant au client qui vient de se connecter
      this.#send(
        ws,
        ScreensWebSocketServer.WS_EVENTS.STATE_UPDATE,
        gameState.getState()
      );

      ws.on('message', (msg) => {
        try {
          const data = JSON.parse(msg.toString());

          if (!data?.type) {
            logger.warn('[Screens] Message reçu sans type');
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

      ws.on('close', () => {
        logger.info('[Screens] Client déconnecté');
      });

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
export const wss = screensWss.wss;
export default screensWss.getServer();
