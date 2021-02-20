import Koa from "koa";
import bodyParser from "koa-bodyparser";
import compress from "koa-compress";
import helmet from "koa-helmet";
import { config } from "../provider/config";
import { info } from "../provider/logger";
import { mountPassport } from "../provider/passport";

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

  // Loads the passport configuration
  mountPassport(app);

  return app;
};
