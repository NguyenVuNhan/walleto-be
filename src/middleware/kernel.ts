import cors from "@koa/cors";
import Koa from "koa";
import { config } from "../provider/config";
import { initHttp } from "./http";
import log from "./log";

export const initKernel = (app: Koa) => {
  if (config.isCorsEnabled) {
    // Enable cors with default options
    app = app.use(cors());
  }

  // Mount basic apis middleware
  app = initHttp(app);

  // Logger middleware -> use winston as logger
  app.use(log());

  return app;
};
