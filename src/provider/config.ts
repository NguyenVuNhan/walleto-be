import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const isDevMode = process.env.NODE_ENV == "development";

export const config = {
  apiPrefix: process.env.API_PREFIX || "api",
  name: process.env.APP_NAME || "My awesome koa app",
  description: process.env.DESCRIPTION || "App description",
  port: process.env.PORT || 5000,
  debugLogging: isDevMode,
  dbsslconn: !isDevMode,
  jwtSecret: process.env.APP_SECRET || "Secret",
  databaseUrl:
    process.env.DATABASE_URL || "postgres://admin:admin@postgres:5432/walleto",
  dbEntitiesPath: [
    ...(isDevMode ? ["src/entity/**/*.ts"] : ["build/entity/**/*.js"]),
  ],
  cronJobExpression: "0 * * * *",
};
