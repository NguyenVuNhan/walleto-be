import Router from "@koa/router";
import auth from "../../controller/auth";

const router = new Router();

router.post("/register", auth.register);

export default router;
