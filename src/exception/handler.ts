import Koa from "koa";

export const errorHandler = (app: Koa) => {
  app.use(async (ctx, next) => {
    try {
      await next();
      const status = ctx.status || 404;
      if (status >= 400) {
        ctx.throw(status);
      }
    } catch (err) {
      ctx.status = err.status || 500;
      let msg: string;
      switch (ctx.status) {
        case 404:
          msg = "Not Found";
          break;
        default:
          msg = "Internal Server Error";
      }
      ctx.body = {
        data: {
          errors: [
            {
              msg,
              param: "error",
            },
          ],
        },
        message: "An error occurred",
        success: false,
      };
    }
  });
};
