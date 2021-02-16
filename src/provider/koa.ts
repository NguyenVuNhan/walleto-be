import Koa from "koa";
import jwt from "koa-jwt";
import * as handler from "../exception/handler";
import { mountSwagger } from "./swagger";
import { initKernel } from "../middleware/kernel";
import { config } from "./config";
import { info } from "./logger";
import { protectedRouter, publicRouter } from "./routes";

export const initKoa = () => {
  const app = new Koa();

  // mount config
  app.use(async (ctx, next) => {
    ctx.state = { ...ctx.state, ...config };
    await next();
  });

  // mount middleware
  initKernel(app);

  // mount handler
  handler.errorHandler(app);

  // mount routes

  // Api documentation
  mountSwagger(app);

  // these routes are NOT protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
  app.use(publicRouter.routes()).use(publicRouter.allowedMethods());

  // JWT middleware -> below this line routes are only reached if JWT token is valid, secret as env variable
  // do not protect swagger-json and swagger-html endpoints
  // app.use(jwt({ secret: config.jwtSecret }));

  // These routes are protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
  // app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());

  app.listen(config.port);
  info(`Server :: Running @ '${config.url}'`);
};
