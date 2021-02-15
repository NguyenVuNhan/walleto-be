import Router from "@koa/router";
import authRouter from "../routes/api/auth";

// ----------------------------------------------------------------------
// Public route
// ----------------------------------------------------------------------
const publicRouter = new Router();

publicRouter.use("/auth", authRouter.routes(), authRouter.allowedMethods());

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
const protectedRouter = new Router();

protectedRouter.get("/protected", async (ctx) => {
  ctx.body = {
    hello: "protected",
  };
});

export { publicRouter, protectedRouter };
