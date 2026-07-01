import { URL } from 'node:url';
import screensWss from './screens.js';
import logger from '../utils/logger.js';

/**
 * setupWebSockets — route les connexions WebSocket vers le bon serveur
 */
const ROUTES = {
  '/screens': screensWss,
};

export function setupWebSockets(httpServer) {
  httpServer.on('upgrade', (request, socket, head) => {
    const { pathname } = new URL(request.url, 'http://localhost');
    const wss = ROUTES[pathname];

    if (!wss) {
      logger.warn(`[WS] Route inconnue : ${pathname}`);
      socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });
}
