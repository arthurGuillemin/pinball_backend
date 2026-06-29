const INITIAL_BALLS = 3;
const TOTAL_LIGHT_SENSORS = 7;

const POINTS_CONFIG = {
  BUMPER: 100,
  SLINGSHOT: 50,
  LIGHT_SENSOR: 200,
  ALL_LIGHTS_BONUS: 1000,
  CARDSDOWN: 4000,
};

const VALID_AVATARS = ['cuphead', 'mugman', 'chalice'];

/**
 * GameState — singleton qui représente l'état d'une partie en cours.
 *
 * Toutes les méthodes de mutation vérifient que la partie est en cours
 * via #assertRunning — aucun effet de bord silencieux possible.
 * Le state n'est jamais muté directement : chaque modification construit
 * un nouvel objet (pattern immutable avec spread + new Set).
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

  // ── Lecture ─────────────────────────────────────────────────────────────────

  /**
   * Retourne une deep copy sérialisable du state.
   * structuredClone garantit qu'aucune référence externe ne peut muter #state.
   * lightsActivated est converti en Array car JSON.stringify ne sait pas
   * sérialiser un Set (retournerait {}).
   */
  getState() {
    const copy = structuredClone(this.#state);
    copy.lightsActivated = Array.from(this.#state.lightsActivated);
    return copy;
  }

  isGameOver() {
    return !this.#state.isRunning;
  }

  // ── Guard interne ───────────────────────────────────────────────────────────

  /**
   * Lève une erreur si aucune partie n'est en cours.
   * Utilisé par toutes les méthodes de mutation pour fail-fast
   * plutôt que de retourner silencieusement l'état courant.
   */
  #assertRunning(context = 'action') {
    if (!this.#state.isRunning) {
      throw new Error(
        `[GameState] ${context} impossible : aucune partie en cours`
      );
    }
  }

  // ── Cycle de vie ────────────────────────────────────────────────────────────

  /**
   * Démarre une nouvelle partie.
   * @throws {Error} si une partie est déjà en cours
   * @throws {Error} si playerName est vide
   */
  startGame(playerName = 'UnknownPlayer', avatar = 'cuphead') {
    if (this.#state.isRunning) {
      throw new Error(
        '[GameState] startGame impossible : une partie est déjà en cours'
      );
    }

    const cleanName = playerName?.trim();
    if (!cleanName) {
      throw new Error('[GameState] playerName est requis');
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

  // ── Points ──────────────────────────────────────────────────────────────────

  /**
   * @throws {Error} si la partie n'est pas en cours
   * @throws {Error} si points n'est pas un nombre positif
   */
  #addPoints(points) {
    this.#assertRunning('addPoints');

    if (typeof points !== 'number' || points < 0) {
      throw new Error(
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

  /**
   * Enregistre l'activation d'un capteur lumineux.
   * Quand tous les capteurs sont activés, accorde un bonus et reset le Set.
   * @throws {Error} si la partie n'est pas en cours
   * @throws {Error} si sensorId est absent ou vide
   */
  registerLightSensor(sensorId) {
    this.#assertRunning('registerLightSensor');

    if (!sensorId) {
      throw new Error('[GameState] sensorId est requis');
    }

    const newLights = new Set(this.#state.lightsActivated);
    newLights.add(sensorId);

    let points = POINTS_CONFIG.LIGHT_SENSOR;

    if (newLights.size === TOTAL_LIGHT_SENSORS) {
      points += POINTS_CONFIG.ALL_LIGHTS_BONUS;
      newLights.clear();
    }

    this.#state = { ...this.#state, lightsActivated: newLights };
    return this.#addPoints(points);
  }

  /**
   * Perd une balle. Met isRunning à false si c'était la dernière.
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
