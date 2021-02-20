import Koa from "koa";
import * as handler from "../exception/handler";
import { initKernel } from "../middleware/kernel";
import { config } from "./config";
import { info } from "./logger";
import { initRouter } from "./routes";
import { mountSwagger } from "./swagger";

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

  initRouter(app);

  // Api documentation
  mountSwagger(app);

  app.listen(config.port);
  info(`Server :: Running @ '${config.url}'`);
};
