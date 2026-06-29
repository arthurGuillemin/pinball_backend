import gameState from '../../game/state.js';

/**
 * Helper shared entre tous les suites de tests
 * Remet le singleton GameState dans son état initial avant chaque test
 */
export function resetGameState() {
  gameState.reset();
}

/**
 * Démarre une partie avec des valeurs par défaut pour les tests.
 */
export function startDefaultGame(
  playerName = 'TestPlayer',
  avatar = 'cuphead'
) {
  return gameState.startGame(playerName, avatar);
}

/**
 * Joue une partie jusqu'au game over (perd les 3 balles).
 */
export function playUntilGameOver() {
  gameState.losesBall();
  gameState.losesBall();
  gameState.losesBall();
}

/**
 * Active tous les capteurs pour déclencher le bonus.
 */
export function activateAllSensors() {
  ['s1', 's2', 's3', 's4', 's5', 's6', 's7'].forEach((s) =>
    gameState.registerLightSensor(s)
  );
}
