import { validate, ValidationError } from "class-validator";
import Koa, { Context } from "koa";

export const validationErrorHandler = async (object: object, ctx: Context) => {
  const errors: ValidationError[] = await validate(object, {
    validationError: { target: false },
    stopAtFirstError: true,
  });

  if (errors.length > 0) {
    ctx.throw(400, new Error("Validation error"), { errors });
  }
};

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
        case 404:
          msg = "Not Found";
          break;
        default:
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
