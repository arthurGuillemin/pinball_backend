import pino from "pino";
import appInsights from "applicationinsights";

const isDev = process.env.NODE_ENV !== "production";
const hasAppInsights = Boolean(process.env.APPINSIGHTS_INSTRUMENTATIONKEY);

function createAppInsightsClient() {
  appInsights
    .setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
    .setAutoCollectRequests(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .start();

  return appInsights.defaultClient;
}

function createBaseLogger(level = "info") {
  return pino({
    level,
    base: undefined,
    timestamp: pino.stdTimeFunctions.isoTime,
  });
}

function applyAppInsightsTransport(baseLogger, client) {
  const isReady = () => Boolean(client?.config);

  const safeTrace = (message, severity, properties = {}) => {
    if (isReady()) {
      client.trackTrace({ message: String(message), severity, properties });
    } else {
      console.log(`[AppInsights fallback] ${message}`, properties);
    }
  };

  const safeException = (error, properties = {}) => {
    const exception = error instanceof Error ? error : new Error(String(error));
    if (isReady()) {
      client.trackException({ exception, properties });
    } else {
      console.error("[AppInsights fallback]", exception);
    }
  };

  baseLogger.info = (message, properties) => safeTrace(message, 1, properties);
  baseLogger.warn = (message, properties) => safeTrace(message, 2, properties);
  baseLogger.error = (error, properties) => safeException(error, properties);

  return baseLogger;
}

function createLogger() {
  if (isDev) {
    return pino({
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
  }

  const baseLogger = createBaseLogger("info");

  if (hasAppInsights) {
    const client = createAppInsightsClient();
    return applyAppInsightsTransport(baseLogger, client);
  }

  return baseLogger;
}

const logger = createLogger();

export default logger;
