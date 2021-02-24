import createRouter from "koa-joi-router";
import passport from "koa-passport";
import transaction from "../../controller/transaction";
import { validateCategoryId } from "../../services/validates/category";
import { addValidate } from "../../services/validates/transaction";
import { validateWalletId } from "../../services/validates/wallet";

const router = createRouter();
router.prefix("/transaction");
router.use(
  passport.authenticate("jwt", { session: false, failWithError: true })
);

router
  //Add transaction
  .post(
    "/",
    { validate: { body: addValidate, type: "json" } },
    validateWalletId,
    validateCategoryId,
    transaction.addTransaction
  );

export default router;
