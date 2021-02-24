import { error, warn } from "../provider/logger";

export const proc = () => {
  // Catch the Process's uncaught-exception
  process.on("uncaughtException", (exception) => error(exception.stack));

  // Catch the Process's warning event
  process.on("warning", (warning) => warn(warning.stack));
};
