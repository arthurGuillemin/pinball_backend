import pino from 'pino';
import appInsights from 'applicationinsights';

const isDev = process.env.NODE_ENV !== 'production';
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

function createBaseLogger(level = 'info') {
  return pino({
    level,
    base: undefined,
    timestamp: pino.stdTimeFunctions.isoTime,
  });
}

function normalizeArgs(a, b) {
  if (typeof a === 'string') {
    return { properties: {}, message: a };
  }
  const properties = a ?? {};
  const message = typeof b === 'string' ? b : JSON.stringify(properties);
  return { properties, message };
}

function applyAppInsightsTransport(baseLogger, client) {
  const isReady = () => Boolean(client?.config);

  const safeTrace = (a, b, severity) => {
    const { properties, message } = normalizeArgs(a, b);
    if (isReady()) {
      client.trackTrace({ message, severity, properties });
    } else {
      console.log(`[AppInsights fallback] ${message}`, properties);
    }
  };

  const safeException = (a, b) => {
    const { properties, message } = normalizeArgs(a, b);
    const error =
      properties?.err instanceof Error ? properties.err : new Error(message);

    if (isReady()) {
      client.trackException({ exception: error, properties });
    } else {
      console.error('[AppInsights fallback]', error);
    }
  };

  baseLogger.info = (a, b) => safeTrace(a, b, 1);
  baseLogger.warn = (a, b) => safeTrace(a, b, 2);
  baseLogger.error = (a, b) => safeException(a, b);

  return baseLogger;
}

function createLogger() {
  if (isDev) {
    return pino({
      level: 'debug',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
        },
      },
    });
  }

  const baseLogger = createBaseLogger('info');

  if (hasAppInsights) {
    const client = createAppInsightsClient();
    return applyAppInsightsTransport(baseLogger, client);
  }

  return baseLogger;
}

const logger = createLogger();

export default logger;
