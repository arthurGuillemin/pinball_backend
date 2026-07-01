import gameState from '../../game/state.js';

export const REAL_SENSOR_IDS = [
  'SENSOR_lane_right_1',
  'SENSOR_lane_right_2',
  'SENSOR_lane_left_1',
  'SENSOR_lane_left_2',
  'SENSOR_lane_rampe',
  'SENSOR_lane_cave',
  'SENSOR_lane_up_right',
];

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
  REAL_SENSOR_IDS.forEach((s) => gameState.registerLightSensor(s));
}
