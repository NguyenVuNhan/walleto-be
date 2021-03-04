import Joi from "joi";
import { Context, Next } from "koa";

interface ValidateConfig extends Joi.BaseValidationOptions {
  subject?: <T = any>(ctx: Context) => T;
  continueOnError?: boolean;
}

export const body = (ctx: Context) => ctx.request.body;

const joiValidate = (
  schema: Joi.ObjectSchema,
  { subject, continueOnError, ...rest }: ValidateConfig = {}
) => async (ctx: Context, next: Next) => {
  if (!subject) subject = body;

  try {
    Joi.attempt(subject(ctx), schema, { abortEarly: false, ...rest });
  } catch (err) {
    if (continueOnError) {
      ctx.errors = err.details;
    } else {
      const errors = err.details.reduce(
        (acc: any, val: any) => ({
          ...acc,
          [val.context.key]: val.message,
        }),
        {}
      );

      ctx.throw("User input error", 400, { errors });
    }
  }
  await next();
};

export default joiValidate;
