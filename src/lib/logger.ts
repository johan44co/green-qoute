import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

export const logger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
  ...(isProduction
    ? {
        // Production: JSON format for log aggregation systems
        formatters: {
          level: (label) => {
            return { level: label };
          },
        },
      }
    : {
        // Development: pretty-printed logs
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            ignore: "pid,hostname",
            translateTime: "HH:MM:ss",
          },
        },
      }),
});

// Helper to create child logger with request context
export function createRequestLogger(
  requestId: string,
  method: string,
  path: string
) {
  return logger.child({
    requestId,
    method,
    path,
  });
}

// Type-safe log helpers
export const log = {
  info: (msg: string, data?: Record<string, unknown>) => logger.info(data, msg),
  error: (
    msg: string,
    error?: Error | unknown,
    data?: Record<string, unknown>
  ) => {
    if (error instanceof Error) {
      logger.error({ ...data, err: error }, msg);
    } else {
      logger.error({ ...data, error }, msg);
    }
  },
  warn: (msg: string, data?: Record<string, unknown>) => logger.warn(data, msg),
  debug: (msg: string, data?: Record<string, unknown>) =>
    logger.debug(data, msg),
};
