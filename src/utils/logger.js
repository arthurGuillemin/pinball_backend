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

  logger = pino({
    level: "info",
    base: undefined,
    timestamp: pino.stdTimeFunctions.isoTime,
  });

  const originalInfo = logger.info.bind(logger);
  const originalWarn = logger.warn.bind(logger);
  const originalError = logger.error.bind(logger);

  logger.info = (...args) => {
    client?.trackTrace({ message: args[0], severity: 1 });
    originalInfo(...args);
  };
  logger.warn = (...args) => {
    client?.trackTrace({ message: args[0], severity: 2 });
    originalWarn(...args);
  };
  logger.error = (...args) => {
    client?.trackException({
      exception: args[0] instanceof Error ? args[0] : new Error(args[0]),
    });
    originalError(...args);
  };
} else {
  logger = pino({ level: "info" });
}

export default logger;
