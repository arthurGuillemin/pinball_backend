import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { createServer } from 'http';

import scoresRouter from './routes/scores.route.js';
import healthRouter from './routes/health.route.js';
import { setupWebSockets } from './sockets/index.js';
import errorHandler from './middlewares/errorHandler.js';
import helmetMiddleware from './middlewares/helmet.js';
import logger from './utils/logger.js';
import env from './config/env.js';
import gameState from './game/state.js';
import screensWssServer, { wss as screensClients } from './sockets/screens.js';
import { NotFoundError } from './utils/appError.js';

process.on('uncaughtException', (err) => {
  logger.error({ err }, 'uncaughtException');
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'unhandledRejection');
  process.exit(1);
});

const app = express();
const httpServer = createServer(app);
app.set('trust proxy', 1);

app.use(helmetMiddleware);

app.use(cors({ origin: env.ALLOWED_ORIGINS }));

app.use(express.json());
app.use(pinoHttp({ logger, redact: ['req.headers.authorization'] }));

app.get('/', (req, res) => res.json({ status: 'server is on' }));
app.use('/api/scores', scoresRouter);
app.use('/api/health', healthRouter);

if (process.env.NODE_ENV === 'e2e') {
  app.post('/__test/reset', async (req, res) => {
    screensClients.clients.forEach((client) => client.terminate());
    await new Promise((resolve) => setTimeout(resolve, 50));
    gameState.reset();
    res.json({ reset: true });
  });
}

setupWebSockets(httpServer);

app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} introuvable`));
});

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(env.PORT, () => {
    logger.info(`Serveur lancé sur le port ${env.PORT}`);
  });
}

export { app, httpServer };
