import Koa from "koa";
import authRouter from "../routes/api/auth";
import categoryRouter from "../routes/api/category";
import transactionRouter from "../routes/api/transaction";
import walletRouter from "../routes/api/wallet";

export const initRouter = (app: Koa) => {
  app.use(authRouter.middleware());
  app.use(categoryRouter.middleware());
  app.use(walletRouter.middleware());
  app.use(transactionRouter.middleware());
};
