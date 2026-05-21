//libs
import express from 'express';
import scoresRouter from './routes/scores.route.js';
import healthRouter from './routes/health.route.js';
import cors from 'cors';
import pinoHttp from 'pino-http';
//functions
import { setupWebSockets } from './sockets/index.js';
import { createServer } from 'http';
import errorHandler from './middlewares/errorHandler.js';
import AppError from './utils/appError.js';
import logger from './utils/logger.js';
import helmetMiddleware from './middlewares/helmet.js';
import env from './config/env.js';

const PORT = env.PORT;
const app = express();
const httpServer = createServer(app);

// cors
const allowedOrigins = env.ALLOWED_ORIGINS;
app.use(
  cors({
    origin: env.NODE_ENV === 'production' ? allowedOrigins : '*',
  })
);

app.use(express.json());
app.use(helmetMiddleware);
app.use(pinoHttp({ logger, redact: ['req.headers.authorization'] }));

// test route
app.get('/', (req, res) => {
  res.json({ status: 'server is on' });
});

//  routes
app.use('/api/scores', scoresRouter);
app.use('/api/health', healthRouter);

// WebSockets
setupWebSockets(httpServer);

logger.info('logger init et pret');
httpServer.listen(PORT, () => {
  logger.info(`Serveur lancé sur le port ${PORT}`);
});

///////////////////////////////////////////
////////// Younes Import
///////////////////////////////////////////

import { WebSocketServer } from 'ws';
import { createMqttBridge, setupMqttBridge } from './bridge/setupBridge.js';
import MySocket from './WebSocket/mySocketLib.js';

///////////////////////////////////////////
////////// Younes
///////////////////////////////////////////
const SOCKET_PORT = '8181';

const mqttBridge = createMqttBridge();
setupMqttBridge(mqttBridge);

mqttBridge.on('message', (topic, message) => {
  const telemetry = JSON.parse(message.toString());
  console.log(telemetry);
  MySocket.sendTo(telemetry);
});

const wss = new WebSocketServer({ port: SOCKET_PORT });

wss.on('connection', (wsocket) => {
  wsocket.on('message', (msg) => {
    let message = JSON.parse(msg);
    console.log(message);
    switch (message.type) {
      case 'handshake':
        message.socket = wsocket;
        MySocket.addSocket(message);
        break;
      case 'message': {
        MySocket.sendTo(message);
        break;
      }
    }
  });
  wsocket.on('close', () => {
    var disconnectedClient = MySocket.removeBySocket(wsocket);
  });
});
logger.info('WebSocket Server Listen on :' + SOCKET_PORT);

//////////////////////////////////////////
////////// Younes
///////////////////////////////////////////

app.use(errorHandler);
export { app, httpServer };
