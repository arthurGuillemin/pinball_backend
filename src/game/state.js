const INITIAL_BALLS = 3;

class GameState {
  #state;

  constructor() {
    this.#state = this.#initialState();
  }

  #initialState() {
    return {
      isRunning: false,
      score: 0,
      balls: INITIAL_BALLS,
      currentPlayer: null,
    };
  }

  getState() {
    return { ...this.#state };
  }

  isGameOver() {
    return this.#state.balls <= 0 && !this.#state.isRunning;
  }

  startGame(playerName = 'Joueur') {
    if (!playerName?.trim()) throw new Error('playerName est requis');
    this.#state = {
      ...this.#initialState(),
      isRunning: true,
      currentPlayer: playerName.trim(),
    };
    return this.getState();
  }

  reset() {
    this.#state = this.#initialState();
    return this.getState();
  }

  registerHit(points) {
    if (!this.#state.isRunning) return this.getState();
    if (typeof points !== 'number' || points <= 0) {
      throw new Error('points doit être un nombre positif');
    }
    this.#state.score += points;
    return this.getState();
  }

  losesBall() {
    if (!this.#state.isRunning) return this.getState();
    this.#state.balls -= 1;
    if (this.#state.balls <= 0) {
      this.#state.isRunning = false;
    }
    return this.getState();
  }
}

export default new GameState();
