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
} else {
  // en prod: app insight
  appInsights
    .setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
    .setAutoCollectRequests(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .start();

  const client = appInsights.defaultClient;

  logger = pino(
    {
      level: "info",
      base: undefined,
      timestamp: pino.stdTimeFunctions.isoTime,
    },
    pino.destination({
      write: (chunk) => {
        try {
          const log = JSON.parse(chunk);
          const severityMap = {
            10: appInsights.Contracts.SeverityLevel.Verbose,
            20: appInsights.Contracts.SeverityLevel.Information,
            30: appInsights.Contracts.SeverityLevel.Warning,
            40: appInsights.Contracts.SeverityLevel.Error,
            50: appInsights.Contracts.SeverityLevel.Critical,
          };
          client.trackTrace({
            message: log.msg,
            severity:
              severityMap[log.level] ||
              appInsights.Contracts.SeverityLevel.Information,
            properties: log,
          });
        } catch (err) {
          client.trackTrace({
            message: chunk,
            severity: appInsights.Contracts.SeverityLevel.Information,
          });
        }
      },
    }),
  );
}

export default logger;
