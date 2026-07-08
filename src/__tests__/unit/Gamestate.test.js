import { describe, it, expect, beforeEach } from 'vitest';
import gameState from '../../game/state.js';
import {
  resetGameState,
  startDefaultGame,
  playUntilGameOver,
  activateAllSensors,
} from '../helpers/gameHelpers.js';

beforeEach(() => {
  resetGameState();
});

// ═══════════════════════════════════════════════════════════════════════════
// ÉTAT INITIAL
// ═══════════════════════════════════════════════════════════════════════════

describe('GameState — état initial', () => {
  it('isRunning est false', () => {
    expect(gameState.getState().isRunning).toBe(false);
  });

  it('score est 0', () => {
    expect(gameState.getState().score).toBe(0);
  });

  it('balls est 3', () => {
    expect(gameState.getState().balls).toBe(3);
  });

  it('currentPlayer est null', () => {
    expect(gameState.getState().currentPlayer).toBeNull();
  });

  it('lightsActivated est un tableau vide', () => {
    expect(gameState.getState().lightsActivated).toEqual([]);
  });

  it('isGameOver retourne true', () => {
    expect(gameState.isGameOver()).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// startGame
// ═══════════════════════════════════════════════════════════════════════════

describe('GameState — startGame', () => {
  it('démarre une partie avec le bon joueur', () => {
    const state = gameState.startGame('Arthur');
    expect(state.isRunning).toBe(true);
    expect(state.currentPlayer).toBe('Arthur');
  });

  it('trim le playerName', () => {
    const state = gameState.startGame('  Arthur  ');
    expect(state.currentPlayer).toBe('Arthur');
  });

  it('accepte un avatar valide', () => {
    const state = gameState.startGame('Arthur', 'mugman');
    expect(state.avatar).toBe('mugman');
  });

  it('accepte chalice comme avatar', () => {
    const state = gameState.startGame('Arthur', 'chalice');
    expect(state.avatar).toBe('chalice');
  });

  it('fallback sur cuphead si avatar invalide', () => {
    const state = gameState.startGame('Arthur', 'pikachu');
    expect(state.avatar).toBe('cuphead');
  });

  it('reset le score à 0 au démarrage', () => {
    startDefaultGame();
    gameState.registerBumperHit();
    gameState.reset();
    const state = gameState.startGame('Bob');
    expect(state.score).toBe(0);
  });

  it('reset les balles à 3 au démarrage', () => {
    startDefaultGame();
    gameState.losesBall();
    gameState.reset();
    const state = gameState.startGame('Bob');
    expect(state.balls).toBe(3);
  });

  it('lance une erreur si playerName est vide', () => {
    expect(() => gameState.startGame('')).toThrow();
  });

  it('lance une erreur si playerName est seulement des espaces', () => {
    expect(() => gameState.startGame('   ')).toThrow();
  });

  it('lance une erreur si une partie est déjà en cours', () => {
    gameState.startGame('Arthur');
    expect(() => gameState.startGame('Bob')).toThrow(
      'une partie est déjà en cours'
    );
  });

  it('isGameOver retourne false après startGame', () => {
    gameState.startGame('Arthur');
    expect(gameState.isGameOver()).toBe(false);
  });

  it('getState retourne une copie — pas une référence', () => {
    gameState.startGame('Arthur');
    const state1 = gameState.getState();
    const state2 = gameState.getState();
    expect(state1).not.toBe(state2);
    expect(state1).toEqual(state2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// GUARDS — impossible d'agir sans partie en cours
// ═══════════════════════════════════════════════════════════════════════════

describe('GameState — guards', () => {
  it('registerBumperHit throw si pas de partie', () => {
    expect(() => gameState.registerBumperHit()).toThrow(
      'aucune partie en cours'
    );
  });

  it('registerSlingshotHit throw si pas de partie', () => {
    expect(() => gameState.registerSlingshotHit()).toThrow(
      'aucune partie en cours'
    );
  });

  it('registerAllCardsDown throw si pas de partie', () => {
    expect(() => gameState.registerAllCardsDown()).toThrow(
      'aucune partie en cours'
    );
  });

  it('registerLightSensor throw si pas de partie', () => {
    expect(() => gameState.registerLightSensor('SENSOR_lane_right_1')).toThrow(
      'aucune partie en cours'
    );
  });

  it('losesBall throw si pas de partie', () => {
    expect(() => gameState.losesBall()).toThrow('aucune partie en cours');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// POINTS
// ═══════════════════════════════════════════════════════════════════════════

describe('GameState — points', () => {
  beforeEach(() => {
    startDefaultGame();
  });

  it('bumper ajoute 100 points', () => {
    expect(gameState.registerBumperHit().score).toBe(100);
  });

  it('slingshot ajoute 50 points', () => {
    expect(gameState.registerSlingshotHit().score).toBe(50);
  });

  it('cards down ajoute 4000 points', () => {
    expect(gameState.registerAllCardsDown().score).toBe(4000);
  });

  it("plusieurs bumpers s'accumulent", () => {
    gameState.registerBumperHit();
    gameState.registerBumperHit();
    expect(gameState.registerBumperHit().score).toBe(300);
  });

  it("différents types de points s'accumulent", () => {
    gameState.registerBumperHit(); // 100
    gameState.registerSlingshotHit(); // 50
    expect(gameState.registerAllCardsDown().score).toBe(4150);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// CAPTEURS LUMINEUX
// ═══════════════════════════════════════════════════════════════════════════

describe('GameState — registerLightSensor', () => {
  beforeEach(() => {
    startDefaultGame();
  });

  it('ajoute 200 points par capteur', () => {
    expect(gameState.registerLightSensor('SENSOR_lane_right_1').score).toBe(
      200
    );
  });

  it('enregistre le capteur dans lightsActivated', () => {
    expect(
      gameState.registerLightSensor('SENSOR_lane_right_1').lightsActivated
    ).toContain('SENSOR_lane_right_1');
  });

  it("n'ajoute pas deux fois le même capteur", () => {
    gameState.registerLightSensor('SENSOR_lane_right_1');
    expect(
      gameState.registerLightSensor('SENSOR_lane_right_1').lightsActivated
        .length
    ).toBe(1);
  });

  it('accorde un bonus et reset quand tous les capteurs sont activés', () => {
    activateAllSensors();
    const state = gameState.getState();
    // 7 × 200 + 1000 bonus = 2400
    expect(state.score).toBe(2400);
    expect(state.lightsActivated).toEqual([]);
  });

  it('throw si sensorId est undefined', () => {
    expect(() => gameState.registerLightSensor()).toThrow(
      'sensorId est requis'
    );
  });

  it('throw si sensorId est une chaîne vide', () => {
    expect(() => gameState.registerLightSensor('')).toThrow(
      'sensorId est requis'
    );
  });

  it('throw si sensorId est null', () => {
    expect(() => gameState.registerLightSensor(null)).toThrow(
      'sensorId est requis'
    );
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// PERTE DE BALLE
// ═══════════════════════════════════════════════════════════════════════════

describe('GameState — losesBall', () => {
  beforeEach(() => {
    startDefaultGame();
  });

  it('décrémente les balles de 1', () => {
    expect(gameState.losesBall().balls).toBe(2);
  });

  it('la partie continue si des balles restent', () => {
    expect(gameState.losesBall().isRunning).toBe(true);
  });

  it('reset lightsActivated à chaque perte de balle', () => {
    gameState.registerLightSensor('SENSOR_lane_right_1');
    expect(gameState.losesBall().lightsActivated).toEqual([]);
  });

  it('game over à la troisième balle perdue', () => {
    playUntilGameOver();
    const state = gameState.getState();
    expect(state.isRunning).toBe(false);
    expect(state.balls).toBe(0);
    expect(gameState.isGameOver()).toBe(true);
  });

  it('conserve le score après game over', () => {
    gameState.registerBumperHit(); // 100
    playUntilGameOver();
    expect(gameState.getState().score).toBe(100);
  });

  it('throw si on perd une balle après game over', () => {
    playUntilGameOver();
    expect(() => gameState.losesBall()).toThrow('aucune partie en cours');
  });

  it('throw si on marque des points après game over', () => {
    playUntilGameOver();
    expect(() => gameState.registerBumperHit()).toThrow(
      'aucune partie en cours'
    );
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// RESET
// ═══════════════════════════════════════════════════════════════════════════

describe('GameState — reset', () => {
  it("remet l'état initial complet", () => {
    startDefaultGame();
    gameState.registerBumperHit();
    gameState.reset();
    const state = gameState.getState();
    expect(state.isRunning).toBe(false);
    expect(state.score).toBe(0);
    expect(state.balls).toBe(3);
    expect(state.currentPlayer).toBeNull();
    expect(state.lightsActivated).toEqual([]);
  });

  it('permet de relancer une partie après reset', () => {
    startDefaultGame();
    gameState.reset();
    expect(() => gameState.startGame('Bob')).not.toThrow();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// IMMUTABILITÉ
// ═══════════════════════════════════════════════════════════════════════════

describe('GameState — immutabilité', () => {
  it('modifier la copie retournée ne mute pas le state interne', () => {
    startDefaultGame();
    const state = gameState.getState();
    state.score = 99999;
    state.currentPlayer = 'hacker';
    expect(gameState.getState().score).toBe(0);
    expect(gameState.getState().currentPlayer).toBe('TestPlayer');
  });

  it('modifier lightsActivated retourné ne mute pas le state interne', () => {
    startDefaultGame();
    gameState.registerLightSensor('SENSOR_lane_right_1');
    const state = gameState.getState();
    state.lightsActivated.push('injected');
    expect(gameState.getState().lightsActivated).not.toContain('injected');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SCÉNARIO COMPLET
// ═══════════════════════════════════════════════════════════════════════════

describe('GameState — scénario complet', () => {
  it('partie complète du début à la fin', () => {
    let state = gameState.startGame('Arthur', 'cuphead');
    expect(state.isRunning).toBe(true);
    expect(state.balls).toBe(3);

    gameState.registerBumperHit(); // 100
    gameState.registerBumperHit(); // 200
    gameState.registerSlingshotHit(); // 250

    activateAllSensors(); // 250 + 2400 = 2650

    state = gameState.losesBall();
    expect(state.balls).toBe(2);
    expect(state.isRunning).toBe(true);
    expect(state.lightsActivated).toEqual([]);

    state = gameState.losesBall();
    expect(state.balls).toBe(1);

    state = gameState.losesBall();
    expect(state.balls).toBe(0);
    expect(state.isRunning).toBe(false);
    expect(state.score).toBe(2650);
    expect(gameState.isGameOver()).toBe(true);
  });
});
