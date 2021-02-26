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
    wallet.add
  )
  // Find wallet
  .get("/:id", validateWalletId(), wallet.getOne)
  // Update wallet
  .post(
    "/:id",
    { validate: { body: updateValidate, type: "json" } },
    validateWalletName,
    wallet.update
  )
  // Delete wallet
  .delete("/:id", validateWalletId(), wallet.delete);

export default router;
