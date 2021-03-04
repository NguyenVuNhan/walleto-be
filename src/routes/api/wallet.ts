import Router from "@koa/router";
import { Context, DefaultState } from "koa";
import passport from "koa-passport";
import wallet from "../../controller/wallet";
import {
  addValidate,
  updateValidate,
  validateWalletId,
  validateWalletName,
} from "../../services/validates/wallet";

const router = new Router<DefaultState, Context>();
router.prefix("/wallet");
router.use(
  passport.authenticate("jwt", { session: false, failWithError: true })
);

router
  // Add wallet
  .post("/", addValidate, validateWalletName, wallet.add)
  // Find wallet
  .get("/:id", validateWalletId(), wallet.getOne)
  // Update wallet
  .post("/:id", updateValidate, validateWalletName, wallet.update)
  // Delete wallet
  .delete("/:id", validateWalletId(), wallet.delete);

export default router;
