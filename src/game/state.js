const INITIAL_BALLS = 3;

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
    };
  }

  getState() {
    return structuredClone(this.#state);
  }

  isGameOver() {
    return !this.#state.isRunning;
  }

  startGame(playerName = 'Joueur') {
    const cleanName = playerName?.trim();

    if (!cleanName) {
      throw new Error('playerName est requis');
    }

    this.#state = {
      ...this.#createInitialState(),
      isRunning: true,
      currentPlayer: cleanName,
    };

    return this.getState();
  }

  reset() {
    this.#state = this.#createInitialState();
    return this.getState();
  }

  registerHit(points = 0) {
    if (!this.#state.isRunning) {
      return this.getState();
    }

    const parsedPoints = Number(points);

    if (Number.isNaN(parsedPoints) || parsedPoints < 0) {
      throw new Error('Points invalides');
    }

    this.#state = {
      ...this.#state,
      score: this.#state.score + parsedPoints,
    };

    return this.getState();
  }

  losesBall() {
    if (!this.#state.isRunning) {
      return this.getState();
    }

    const remainingBalls = Math.max(this.#state.balls - 1, 0);

    this.#state = {
      ...this.#state,
      balls: remainingBalls,
      isRunning: remainingBalls > 0,
    };

    return this.getState();
  }
}

export default new GameState();
