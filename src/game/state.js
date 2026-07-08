import { ConflictError, ValidationError } from '../utils/appError.js';

const INITIAL_BALLS = 3;
const MAX_PLAYER_NAME_LENGTH = 20;

const POINTS_CONFIG = {
  BUMPER: 100,
  SLINGSHOT: 50,
  LIGHT_SENSOR: 200,
  ALL_LIGHTS_BONUS: 1000,
  CARDSDOWN: 4000,
};

const VALID_AVATARS = ['cuphead', 'mugman', 'chalice'];

export const VALID_SENSOR_IDS = [
  'SENSOR_lane_right_1',
  'SENSOR_lane_right_2',
  'SENSOR_lane_left_1',
  'SENSOR_lane_left_2',
  'SENSOR_lane_rampe',
  'SENSOR_lane_cave',
  'SENSOR_lane_up_right',
];

/**
 * GameState — singleton qui représente le state e la partie en cours
 */
class GameState {
  #state;

  constructor() {
    this.reset();
  }

  // ── État initial ────────────────────────────────────────────────────────────

  #createInitialState() {
    return {
      isRunning: false,
      score: 0,
      balls: INITIAL_BALLS,
      currentPlayer: null,
      avatar: 'cuphead',
      lightsActivated: new Set(),
    };
  }

  //  Lecture ─────────────────────────────────────────────────────────────────

  getState() {
    return {
      ...this.#state,
      lightsActivated: Array.from(this.#state.lightsActivated),
    };
  }

  isGameOver() {
    return !this.#state.isRunning;
  }

  //  Guard interne ───────────────────────────────────────────────────────────

  #assertRunning(context = 'action') {
    if (!this.#state.isRunning) {
      throw new ConflictError(
        `[GameState] ${context} impossible : aucune partie en cours`
      );
    }
  }

  //  Cycle de vie ────────────────────────────────────────────────────────────

  /**
   * @throws {Error} si une partie est déjà en cours
   * @throws {Error} si playerName est vide ou trop long
   */
  startGame(playerName, avatar = 'cuphead') {
    if (this.#state.isRunning) {
      throw new ConflictError(
        '[GameState] startGame impossible : une partie est déjà en cours'
      );
    }

    const cleanName = playerName?.trim();
    if (!cleanName) {
      throw new ValidationError('[GameState] playerName est requis');
    }
    if (cleanName.length > MAX_PLAYER_NAME_LENGTH) {
      throw new ValidationError(
        `[GameState] playerName trop long (max ${MAX_PLAYER_NAME_LENGTH} caractères)`
      );
    }

    const cleanAvatar = VALID_AVATARS.includes(avatar) ? avatar : 'cuphead';

    this.#state = {
      ...this.#createInitialState(),
      isRunning: true,
      currentPlayer: cleanName,
      avatar: cleanAvatar,
    };

    return this.getState();
  }

  reset() {
    this.#state = this.#createInitialState();
    return this.getState();
  }

  //  Points ──────────────────────────────────────────────────────────────────

  /**
   * @throws {Error} si la partie n'est pas en cours
   * @throws {Error} si points n'est pas un nombre positif
   */
  #addPoints(points) {
    this.#assertRunning('addPoints');

    if (typeof points !== 'number' || points < 0) {
      throw new ValidationError(
        '[GameState] Points invalides : doit être un nombre positif'
      );
    }

    this.#state = { ...this.#state, score: this.#state.score + points };
    return this.getState();
  }

  /** @throws {Error} si la partie n'est pas en cours */
  registerBumperHit() {
    this.#assertRunning('registerBumperHit');
    return this.#addPoints(POINTS_CONFIG.BUMPER);
  }

  /** @throws {Error} si la partie n'est pas en cours */
  registerSlingshotHit() {
    this.#assertRunning('registerSlingshotHit');
    return this.#addPoints(POINTS_CONFIG.SLINGSHOT);
  }

  /** @throws {Error} si la partie n'est pas en cours */
  registerAllCardsDown() {
    this.#assertRunning('registerAllCardsDown');
    return this.#addPoints(POINTS_CONFIG.CARDSDOWN);
  }

  registerLightSensor(sensorId) {
    this.#assertRunning('registerLightSensor');
    if (!sensorId) {
      throw new ValidationError('[GameState] sensorId est requis');
    }
    if (!VALID_SENSOR_IDS.includes(sensorId)) {
      throw new ValidationError(`[GameState] sensorId inconnu : ${sensorId}`);
    }

    const newLights = new Set(this.#state.lightsActivated);
    newLights.add(sensorId);
    let points = POINTS_CONFIG.LIGHT_SENSOR;

    if (newLights.size === VALID_SENSOR_IDS.length) {
      points += POINTS_CONFIG.ALL_LIGHTS_BONUS;
      newLights.clear();
    }

    this.#state = { ...this.#state, lightsActivated: newLights };
    return this.#addPoints(points);
  }

  /**
   * @throws {Error} si la partie n'est pas en cours
   */
  losesBall() {
    this.#assertRunning('losesBall');

    const remainingBalls = Math.max(this.#state.balls - 1, 0);

    this.#state = {
      ...this.#state,
      balls: remainingBalls,
      isRunning: remainingBalls > 0,
      lightsActivated: new Set(),
    };

    return this.getState();
  }
}

export default new GameState();
