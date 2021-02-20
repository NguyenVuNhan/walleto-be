import Koa from "koa";
import authRouter from "../routes/api/auth";
import categoryRouter from "../routes/api/category";

export const initRouter = (app: Koa) => {
  app.use(authRouter.middleware());
  app.use(categoryRouter.middleware());
};
