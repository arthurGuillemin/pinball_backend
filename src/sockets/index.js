import { URL } from 'node:url';
import esp32Wss from '../sockets/hardware.js';
import screensWss from '../sockets/screens.js';
import logger from '../utils/logger.js';

const ROUTES = {
  '/esp32': esp32Wss,
  '/screens': screensWss,
};

export function setupWebSockets(httpServer) {
  httpServer.on('upgrade', (request, socket, head) => {
    const { pathname } = new URL(request.url, 'http://localhost');
    const wss = ROUTES[pathname];

    if (!wss) {
      logger.warn(`[WS] Route inconnue : ${pathname}`);
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });
}
