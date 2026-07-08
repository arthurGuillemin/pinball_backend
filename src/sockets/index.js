import { URL } from 'node:url';
import screensWss from './screens.js';
import logger from '../utils/logger.js';

export function setupWebSockets(httpServer) {
  httpServer.on('upgrade', (request, socket, head) => {
    const { pathname } = new URL(request.url, 'http://localhost');

    if (pathname !== '/screens') {
      logger.warn(`[WS] Route inconnue : ${pathname}`);
      socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
      socket.destroy();
      return;
    }

    screensWss.handleUpgrade(request, socket, head, (ws) => {
      screensWss.emit('connection', ws, request);
    });
  });
}
