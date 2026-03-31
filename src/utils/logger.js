import pino from "pino";
import appInsights from "applicationinsights";

const isDev = process.env.NODE_ENV !== "production";

let logger;
let aiClient = null;

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
} else {
  if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
    appInsights
      .setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
      .setAutoCollectRequests(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectExceptions(true)
      .start();

    aiClient = appInsights.defaultClient;
  }

  logger = pino({
    level: "info",
    base: undefined,
    timestamp: pino.stdTimeFunctions.isoTime,
  });
}

const sendToAzure = (level, msg, meta = {}) => {
  if (!aiClient) return;

  const severityMap = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    fatal: 4,
  };

  aiClient.trackTrace({
    message: msg,
    severity: severityMap[level] ?? 1,
    properties: meta,
  });
};

export default {
  info: (msg, meta) => {
    logger.info(meta, msg);
    sendToAzure("info", msg, meta);
  },
  warn: (msg, meta) => {
    logger.warn(meta, msg);
    sendToAzure("warn", msg, meta);
  },
  error: (msg, meta) => {
    logger.error(meta, msg);
    sendToAzure("error", msg, meta);
  },
  debug: (msg, meta) => {
    logger.debug(meta, msg);
    sendToAzure("debug", msg, meta);
  },
};
