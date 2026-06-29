import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'src/__tests__/unit/**/*.test.js',
      'src/__tests__/integration/**/*.test.js',
      'src/__tests__/e2e/**/*.test.js',
    ],
    environment: 'node',
    globals: false,
    // threads au lieu de forks — les modules sont partagés entre les fichiers
    // ce qui garantit que httpServer importé dans les tests E2E
    // est la même instance que celle qui écoute sur le port
    pool: 'threads',
    poolOptions: {
      threads: {
        // Chaque fichier de test dans son propre thread pour isolation du singleton
        singleThread: false,
      },
    },
    hookTimeout: 20000,
    testTimeout: 10000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/game/**', 'src/sockets/**', 'src/services/**'],
      exclude: ['src/__tests__/**'],
    },
  },
});
