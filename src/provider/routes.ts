import Koa from "koa";
import authRouter from "../routes/api/auth";

export const initRouter = (app: Koa) => {
  // these routes are NOT protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
  app.use(authRouter.middleware());

  // JWT middleware -> below this line routes are only reached if JWT token is valid, secret as env variable
  // do not protect swagger-json and swagger-html endpoints
  // app.use(jwt({ secret: config.jwtSecret }));

  // These routes are protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
  // app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());
};
