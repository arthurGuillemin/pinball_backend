import { URL } from 'node:url';
import screensWss from './screens.js';
import logger from '../utils/logger.js';

/**
 * setupWebSockets — route les connexions WebSocket vers le bon serveur
 * en fonction du pathname de l'URL d'upgrade.
 *
 * Architecture noServer: true sur chaque WebSocketServer pour garder
 * le contrôle total du handshake HTTP → permet le routing multi-endpoint
 * sur un seul port HTTP.
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
      // Réponse HTTP propre avant destruction du socket
      socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });
}
