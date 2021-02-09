import Router from "@koa/router";
import { SwaggerRouter } from "koa-swagger-decorator";
import { config } from "./config";

// ----------------------------------------------------------------------
// Public route
// ----------------------------------------------------------------------
const publicRouter = new Router();

publicRouter.get("/", async (ctx) => {
  ctx.body = {
    hello: "Hello",
  };
});

publicRouter.get("/error", async (ctx) => {
  ctx.body = {
    hello: "Hello",
    fail: 0 / 0,
  };
  throw new Error("");
});

// ----------------------------------------------------------------------
// Protected route
// ----------------------------------------------------------------------
const protectedRouter = new SwaggerRouter();

// Swagger endpoint
protectedRouter.swagger({
  title: config.name,
  description: config.description,
});

// mapDir will scan the input dir, and automatically call router.map to all Router Class
protectedRouter.mapDir(__dirname);

export { publicRouter, protectedRouter };
