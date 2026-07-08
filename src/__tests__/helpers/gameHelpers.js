import gameState from '../../game/state.js';
import { VALID_SENSOR_IDS } from '../../game/state.js';

/**
 * Helper partagé entre tous les suites de tests.
 * Remet le singleton GameState dans son état initial avant chaque test
 */
export function resetGameState() {
  gameState.reset();
}

export function startDefaultGame(
  playerName = 'TestPlayer',
  avatar = 'cuphead'
) {
  return gameState.startGame(playerName, avatar);
}

export function playUntilGameOver() {
  gameState.losesBall();
  gameState.losesBall();
  gameState.losesBall();
}

export function activateAllSensors() {
  VALID_SENSOR_IDS.forEach((s) => gameState.registerLightSensor(s));
}
