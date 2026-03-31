// src/utils/logger.js
import pino from "pino";
import appInsights from "applicationinsights";

const isDev = process.env.NODE_ENV !== "production";

let logger;

if (isDev) {
  logger = pino({
    level: "debug",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
  });
} else if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
  appInsights
    .setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
    .setAutoCollectRequests(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .start();

  const client = appInsights.defaultClient;

  const fallbackLog = (...args) => console.log(...args);

  logger = pino({
    level: "info",
    base: undefined,
    timestamp: pino.stdTimeFunctions.isoTime,
  });

  const trackSafe = (fn, severity, args) => {
    if (client?._logApi) {
      fn({
        message: args[0],
        severity,
        properties: args[1] || {},
      });
    } else {
      fallbackLog(...args);
    }
  };

  logger.info = (...args) => trackSafe(client.trackTrace.bind(client), 1, args);
  logger.warn = (...args) => trackSafe(client.trackTrace.bind(client), 2, args);
  logger.error = (...args) => {
    if (client?._logApi) {
      client.trackException({
        exception: args[0] instanceof Error ? args[0] : new Error(args[0]),
      });
    } else {
      fallbackLog(...args);
    }
  };
} else {
  logger = pino({
    level: "info",
    base: undefined,
    timestamp: pino.stdTimeFunctions.isoTime,
  });
}

export default logger;
