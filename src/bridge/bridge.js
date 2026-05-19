import logger from '../utils/logger.js';

import { makeBridge, setupMqtt } from './setupBridge.js';

const mqttClient = makeBridge();

setupMqtt(mqttClient);

mqttClient.on('message', (topic, message) => {
  const telemetry = JSON.parse(message.toString());
  logger.info(telemetry);
});
