import createRouter from "koa-joi-router";
import passport from "koa-passport";
import wallet from "../../controller/wallet";
import {
  validateWalletId,
  validateWalletName,
} from "../../services/validates/wallet";

const router = createRouter();
router.prefix("/wallet");
router.use(
  passport.authenticate("jwt", { session: false, failWithError: true })
);

router
  // Add wallet
  .post("/", validateWalletName, wallet.addWallet)
  // Find wallet
  .get("/:id", validateWalletId, wallet.getWallet)
  // Update wallet
  .post("/:id", validateWalletId, validateWalletName, wallet.updateWallet);

export default router;
