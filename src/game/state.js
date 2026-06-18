const INITIAL_BALLS = 3;
const TOTAL_LIGHT_SENSORS = 7;
const POINTS_CONFIG = {
  BUMPER: 100,
  SLINGSHOT: 50,
  LIGHT_SENSOR: 200,
  ALL_LIGHTS_BONUS: 1000,
  CARDSDOWN: 4000,
};

class GameState {
  #state;

  constructor() {
    this.reset();
  }

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

  getState() {
    const stateCopy = structuredClone(this.#state);
    stateCopy.lightsActivated = Array.from(this.#state.lightsActivated);
    return stateCopy;
  }

  isGameOver() {
    return !this.#state.isRunning;
  }

  startGame(playerName = 'UnknowPlayer', avatar = 'cuphead') {
    const cleanName = playerName?.trim();
    if (!cleanName) {
      throw new Error('playerName est requis');
    }

    const validAvatars = ['cuphead', 'mugman', 'chalice'];
    const cleanAvatar = validAvatars.includes(avatar) ? avatar : 'cuphead';

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

  #addPoints(points) {
    if (!this.#state.isRunning) return this.getState();
    if (typeof points !== 'number' || points < 0)
      throw new Error('Points invalides');
    this.#state = { ...this.#state, score: this.#state.score + points };
    return this.getState();
  }

  registerBumperHit() {
    return this.#addPoints(POINTS_CONFIG.BUMPER);
  }

  registerSlingshotHit() {
    return this.#addPoints(POINTS_CONFIG.SLINGSHOT);
  }

  registerAllCardsDown() {
    return this.#addPoints(POINTS_CONFIG.CARDSDOWN);
  }

  registerLightSensor(sensorId) {
    if (!this.#state.isRunning) return this.getState();
    this.#state.lightsActivated.add(sensorId);

    let points = POINTS_CONFIG.LIGHT_SENSOR;
    if (this.#state.lightsActivated.size === TOTAL_LIGHT_SENSORS) {
      points += POINTS_CONFIG.ALL_LIGHTS_BONUS;
      this.#state.lightsActivated.clear();
    }

    return this.#addPoints(points);
  }

  losesBall() {
    if (!this.#state.isRunning) return this.getState();

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
