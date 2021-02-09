import Koa from "koa";
import bodyParser from "koa-bodyparser";
import compress from "koa-compress";
import helmet from "koa-helmet";
import { config } from "../provider/config";
import { info } from "../provider/logger";

export const initHttp = (app: Koa) => {
  info("Booting the 'HTTP' middleware");

  // Provides important security headers to make your app more secure
  app.use(helmet());

  // Enable bodyParser with default options
  app.use(
    bodyParser({
      jsonLimit: config.maxUploadLimit,
      formLimit: config.maxUploadLimit,
    })
  );

  app.use(compress());

  return app;
};
