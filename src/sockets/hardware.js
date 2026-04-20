import { WebSocketServer } from 'ws';
import logger from '../utils/logger.js';

const esp32Wss = new WebSocketServer({ noServer: true });

esp32Wss.on('connection', (ws) => {
  logger.info('Client co sur /esp32');

  ws.on('message', (msg) => {
    const data = msg.toString();
    logger.info('Event ESP32 reçu:', data);

    esp32Wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(data);
      }
    });
  });

  ws.on('close', () => logger.info('Client /esp32 déconnecté'));
});

export default esp32Wss;
