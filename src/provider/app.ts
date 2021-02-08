import { createConnection } from "typeorm";
import { config } from "./config";
import { initKoa } from "./koa";
import { error, info } from "./logger";

export const clearConsole = () => {
  process.stdout.write("\x1B[2J\x1B[0f");
};

export const loadServer = () => {
  info("Server :: Booting @ master ...");

  initKoa();
};

export const loadDatabase = () =>
  (async () => {
    info("Database :: Booting @ master ...");

    try {
      createConnection({
        type: "postgres",
        url: config.databaseUrl,
        synchronize: true,
        logging: false,
        entities: config.dbEntitiesPath,
      });
    } catch (err) {
      error("TypeORM connection error: ", err);
    }
  })();
