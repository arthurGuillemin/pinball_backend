import mqtt from 'mqtt';
import env from '../config/env.js';
import logger from '../utils/logger.js';

const MQTT_CONFIG = {
  host: env.MQTT_SERVER_IP || 'mqtt://localhost:1883',
  username: env.MQTT_USERNAME || 'arthur',
  password: env.MQTT_PASSWORD || '1234',
  topic: env.MQTT_TOPIC || 'Pinball/Team7',
};

export function createMqttBridge() {
  return mqtt.connect(MQTT_CONFIG.host, {
    reconnectPeriod: 1000,
    username: MQTT_CONFIG.username,
    password: MQTT_CONFIG.password,
  });
}

export function setupMqttBridge(mqttBridge) {
  mqttBridge.on('connect', () => {
    mqttBridge.subscribe(MQTT_CONFIG.topic, (err) => {
      if (err) {
        logger.error(`Subscribe failed: ${err.message}`);
        return;
      } else {
        logger.info('subscribed to TOPIC --> ' + MQTT_CONFIG.topic);
        mqttBridge.publish('PinBall', 'Connected ...');
      }
    });
  });
  mqttBridge.on('error', (err) => {
    logger.error('ERROR');
  });

  mqttBridge.on('close', () => {
    logger.warn('Connection closed');
  });

  mqttBridge.on('reconnect', () => {
    logger.info('Reconnecting...');
  });

  mqttBridge.on('offline', () => {
    logger.info('offline');
  });
}
