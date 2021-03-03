import Router from "@koa/router";
import Koa from "koa";
import authRouter from "../routes/api/auth";
import categoryRouter from "../routes/api/category";
import transactionRouter from "../routes/api/transaction";
import walletRouter from "../routes/api/wallet";
import { config } from "./config";

export const initRouter = (app: Koa) => {
  const router = new Router();
  router.prefix("/" + config.apiPrefix);

  router.use(authRouter.middleware());
  router.use(categoryRouter.middleware());
  router.use(walletRouter.middleware());
  router.use(transactionRouter.middleware());

  app.use(router.middleware());
};
