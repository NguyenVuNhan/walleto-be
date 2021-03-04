import auth from "../../controller/auth";
import Router from "@koa/router";
import { loginValidate, registerValidate } from "../../services/validates/auth";

const router = new Router();
router.prefix("/auth");

router
  .post("/login", loginValidate, auth.login)
  .post("/register", registerValidate, auth.register);

export default router;
