import Koa from "koa";
import jwt from "koa-jwt";
import bodyParser from "koa-bodyparser";
import helmet from "koa-helmet";
import cors from "@koa/cors";
import { createConnection } from "typeorm";
import "reflect-metadata";

import { info } from "./provider/logger";
import { config } from "./provider/config";
import { cron } from "./provider/cron";
import { publicRouter, protectedRouter } from "./provider/routes";
import { cpus } from "os";
import cluster from "cluster";
import log from "./middleware/log";

if (cluster.isMaster) {
  const CPUS: number = cpus().length;
  info(`This machine has ${CPUS} CPUs.`);
  for (let i = 0; i < CPUS; i++) {
    cluster.fork();
  }

  cluster.on("online", (worker) => {
    info(`Worker ${worker.process.pid} is online`);
  });

  cluster.on("exit", (worker, code, signal) => {
    info(
      `Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`
    );
    info("Starting a new worker...");
    cluster.fork();
  });
} else {
  createConnection({
    type: "postgres",
    url: config.databaseUrl,
    synchronize: true,
    logging: false,
    entities: config.dbEntitiesPath,
  })
    .then(async () => {
      const app = new Koa();

      // Provides important security headers to make your app more secure
      app.use(helmet());

      // Enable cors with default options
      app.use(cors());

      // Logger middleware -> use winston as logger
      app.use(log());

      // Enable bodyParser with default options
      app.use(bodyParser());

      // these routes are NOT protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
      app.use(publicRouter.routes()).use(publicRouter.allowedMethods());

      // JWT middleware -> below this line routes are only reached if JWT token is valid, secret as env variable
      // do not protect swagger-json and swagger-html endpoints
      app.use(
        jwt({ secret: config.jwtSecret }).unless({ path: [/^\/swagger-/] })
      );

      // These routes are protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
      app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());

      // Register cron job to do any action needed
      cron.start();

      app.listen(config.port);

      // eslint-disable-next-line no-console
      console.log(`Server running on port ${config.port}`);
    })
    // eslint-disable-next-line no-console
    .catch((error: string) => console.log("TypeORM connection error: ", error));
}
