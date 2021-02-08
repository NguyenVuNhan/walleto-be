import { config } from "./config";
import winston, { transports, format } from "winston";
import "winston-daily-rotate-file";
import * as path from "path";

winston.configure({
  level: config.debugLogging ? "debug" : "info",
  transports: [
    // - Write all logs error (and below) to `error.log`.
    new transports.DailyRotateFile({
      filename: path.resolve(__dirname, "../../.logs/%DATE%.log"),
      datePattern: "DD-MM-yyyy",
      format: format.combine(
        format.timestamp(),
        format.printf(
          (info) => `${info.timestamp} [${info.level}]: ${info.message}`
        )
      ),
    }),
    // - Write to all logs with specified level to console.
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});

export const info = (msg: string, ...rest: undefined[]) =>
  winston.info(msg, ...rest);
export const warn = (msg: string, ...rest: undefined[]) =>
  winston.warn(msg, ...rest);
export const error = (msg: string, ...rest: undefined[]) =>
  winston.error(msg, ...rest);

export default winston;
