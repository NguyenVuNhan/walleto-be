import Router from "@koa/router";
import auth from "../../controller/auth";

const router = new Router();

router.get("/", async (ctx) => {
  ctx.body = {
    hello: "Hello",
  };
});

router.post("/register", auth.register);

export default router;
