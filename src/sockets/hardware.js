import { WebSocketServer } from 'ws';
import logger from '../utils/logger.js';

const esp32Wss = new WebSocketServer({ noServer: true });

const broadcast = (data) => {
  esp32Wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(data);
    }
  });
};

esp32Wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    const data = msg.toString();
    logger.info('[ESP32] Event reçu :', data);
    broadcast(data);
  });

  ws.on('error', (err) => logger.error('[ESP32] Erreur WS :', err.message));
});

export default esp32Wss;
