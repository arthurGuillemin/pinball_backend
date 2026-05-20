import logger from '../utils/logger.js';

import { createMqttBridge, setupMqttBridge } from './setupBridge.js';

const mqttBridge = createMqttBridge();

setupMqttBridge(mqttBridge);

mqttBridge.on('message', (topic, message) => {
  const telemetry = JSON.parse(message.toString());
  logger.info(telemetry);
});
