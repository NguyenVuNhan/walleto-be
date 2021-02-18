import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const isDevMode = process.env.NODE_ENV === "development";

export const config = {
  apiPrefix: process.env.API_PREFIX || "api",
  isCorsEnabled: process.env.CORS_ENABLED || true,
  url: process.env.APP_URL || `http://localhost`,
  maxUploadLimit: process.env.APP_MAX_UPLOAD_LIMIT || "50mb",
  name: process.env.APP_NAME || "My awesome koa app",
  description: process.env.DESCRIPTION || "App description",
  port: process.env.PORT || 5000,
  debugLogging: isDevMode,
  dbsslconn: !isDevMode,
  jwtSecret: process.env.APP_SECRET || "Secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || 1,
  databaseUrl:
    process.env.DATABASE_URL || "postgres://admin:admin@postgres:5432/walleto",
  dbEntitiesPath: [
    ...(isDevMode
      ? [`${__dirname}/../entity/**/*.ts`]
      : [`${__dirname}/../entity/**/*.js`]),
  ],
  cronJobExpression: "0 * * * *",
};
