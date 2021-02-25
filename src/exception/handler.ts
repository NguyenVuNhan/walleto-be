import Koa from "koa";
import { config } from "../provider/config";

export const errorHandler = (app: Koa) => {
  app.use(async (ctx, next) => {
    try {
      await next();
      const status = ctx.status || 404;
      if (status === 404) {
        ctx.throw(status);
      }
    } catch (err) {
      ctx.status = err.status || 500;
      let msg: string;
      let errors = [];

      switch (ctx.status) {
        case 400:
          msg = err.message;
          errors = err.errors;
          break;
        case 401:
          msg = "Unauthorized";
          break;
        case 404:
          msg = err.message || "Not Found";
          break;
        default:
          // eslint-disable-next-line no-console
          if (config.debugLogging) console.log(err);
          msg = "Internal Server Error";
      }
      ctx.body = {
        data: {
          msg,
          errors,
        },
        message: "An error occurred",
        success: false,
      };
    }
  });
};
