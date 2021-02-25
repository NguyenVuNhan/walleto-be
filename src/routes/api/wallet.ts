import createRouter from "koa-joi-router";
import passport from "koa-passport";
import wallet from "../../controller/wallet";
import {
  addValidate,
  updateValidate,
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
  .post(
    "/",
    { validate: { body: addValidate, type: "json" } },
    validateWalletName,
    wallet.addWallet
  )
  // Find wallet
  .get("/:id", validateWalletId(), wallet.getWallet)
  // Update wallet
  .post(
    "/:id",
    { validate: { body: updateValidate, type: "json" } },
    validateWalletId(),
    validateWalletName,
    wallet.updateWallet
  )
  // Delete wallet
  .delete("/:id", validateWalletId(), wallet.deleteWallet);

export default router;
