import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

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

  return pino({
    level: 'info',
    base: undefined,
    timestamp: pino.stdTimeFunctions.isoTime,
  });
}

const logger = createLogger();

export default logger;
