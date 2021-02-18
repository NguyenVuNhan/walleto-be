import Koa from "koa";
import jwt from "koa-jwt";
import authRouter from "../routes/api/auth";
import { config } from "./config";

export const initRouter = (app: Koa) => {
  // these routes are NOT protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
  app.use(authRouter.middleware());

  // JWT middleware -> below this line routes are only reached if JWT token is valid, secret as env variable
  app.use(jwt({ secret: config.jwtSecret }));
};
