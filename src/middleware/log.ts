import { Context, Next } from "koa";
import winston from "../provider/logger";

const log = () => async (ctx: Context, next: Next): Promise<void> => {
  const start = new Date().getTime();
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
  }
  const ms = new Date().getTime() - start;

  let logLevel: string;
  if (ctx.status >= 500) {
    logLevel = "error";
  } else if (ctx.status >= 400) {
    logLevel = "warn";
  } else {
    logLevel = "info";
  }

  const msg = `${ctx.method} ${ctx.originalUrl} ${ctx.status} ${ms}ms`;

  winston.log(logLevel, msg);
};

export default log;
