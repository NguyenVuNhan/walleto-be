import { config } from "./config";
import winston, { transports, format } from "winston";
import * as path from "path";

winston.configure({
  level: config.debugLogging ? "debug" : "info",
  transports: [
    //
    // - Write all logs error (and below) to `error.log`.
    new transports.File({
      filename: path.resolve(__dirname, "../../error.log"),
      level: "error",
    }),
    //
    // - Write to all logs with specified level to console.
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});

export const info = (msg: string) => winston.info(msg);
export const warn = (msg: string) => winston.warn(msg);
export const error = (msg: string) => winston.error(msg);

export default winston;
