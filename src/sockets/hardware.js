import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import logger from '../utils/logger.js';
import { createMqttBridge, setupMqttBridge } from '../bridge/setupBridge.js';

class ESP32 {
  mqttBridge;

  static WS_EVENTS = {
    STATE_UPDATE: 'state_update',
    GAME_OVER: 'game_over',
  };
  static MESSAGE_TYPES = {
    HAND_SHAKE: 'handshake',
    BUTTON_EVENT: 'button_event',
  };

  constructor() {
    this.wss = new WebSocketServer({ noServer: true });
    this.setupMessageHandlers();
    this.setupConnection();
    this.initMqttBridge();
  }
  initMqttBridge() {
    this.mqttBridge = createMqttBridge();
    setupMqttBridge(this.mqttBridge);
    this.mqttBridge.on('message', (topic, message) => {
      const telemetry = JSON.parse(message.toString());
      this.handleKeyDown(telemetry);
    });
  }

  setupMessageHandlers() {
    this.messageHandlers = {
      [ESP32.MESSAGE_TYPES.HAND_SHAKE]: this.handleHandShake.bind(this),
      [ESP32.MESSAGE_TYPES.BUTTON_EVENT]: this.handleKeyDown.bind(this),
    };
  }

  send(client, button, state, force) {
    if (client.readyState !== 1) return;
    client.send(
      JSON.stringify({
        button,
        state,
        force,
      })
    );
  }

  broadcast(type, state, force) {
    this.wss.clients.forEach((client) => {
      this.send(client, type, state, force);
    });
  }
  handleKeyDown(data) {
    this.broadcast(data.button, data.state, data?.force);
  }
  handleHandShake(data) {
    console.log(data);
  }
  setupConnection() {
    this.wss.on('connection', (ws) => {
      logger.info('Connected');
      ws.on('message', (msg) => {
        logger.info(msg.toString());
        try {
          const data = JSON.parse(msg.toString());
          if (!data?.type) {
            logger.warn('[ESP32] Message sans type');
            return;
          }
          const handler = this.messageHandlers[data.type];
          if (!handler) {
            logger.warn(`[ESP32] Type de message inconnu : ${data.type}`);
            return;
          }
          handler(data);
        } catch (err) {
          logger.error('[ESP32] Erreur traitement message :', err.message);
        }
      });
      ws.on('close', () => {
        logger.warn('SERVER CLOSED');
      });
      ws.on('error', (err) => {
        logger.error('[ESP32] Erreur WS :', err.message);
      });
    });
  }
  getServer() {
    return this.wss;
  }
}

const espWss = new ESP32();
export default espWss.getServer();
