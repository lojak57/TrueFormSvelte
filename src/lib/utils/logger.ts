import { dev } from "$app/environment";
import pino from "pino";

// Create logger with appropriate configuration for environment
const logger = pino({
  level: dev ? "debug" : "info",
  transport: dev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          ignore: "pid,hostname",
          translateTime: "SYS:standard",
        },
      }
    : undefined,
  redact: {
    paths: ["password", "email", "authorization", "cookie"],
    censor: "[REDACTED]",
  },
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      headers: {
        "user-agent": req.headers?.["user-agent"],
        "content-type": req.headers?.["content-type"],
      },
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
    err: pino.stdSerializers.err,
  },
});

// Create child loggers for different contexts
export const createLogger = (context: string) => {
  return logger.child({ context });
};

// Export pre-configured loggers for common contexts
export const apiLogger = createLogger("api");
export const authLogger = createLogger("auth");
export const dbLogger = createLogger("database");
export const paymentLogger = createLogger("payment");

// Export the base logger
export default logger;
