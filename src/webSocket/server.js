import { WebSocketServer } from 'ws';

import MySocket from './mySocketLib.js';
import logger from '../utils/logger.js';
import { createMqttBridge, setupMqttBridge } from '../bridge/setupBridge.js';

const PORT = '8181';

const mqttBridge = createMqttBridge();
setupMqttBridge(mqttBridge);

mqttBridge.on('message', (topic, message) => {
  const telemetry = JSON.parse(message.toString());
  console.log(telemetry);
  MySocket.sendTo(telemetry);
});

const wss = new WebSocketServer({ port: PORT });

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

console.log('WebSocket Server Listen on ws://localhost:' + PORT);
