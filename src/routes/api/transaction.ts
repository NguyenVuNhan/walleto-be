import createRouter from "koa-joi-router";
import passport from "koa-passport";
import transaction from "../../controller/transaction";
import { validateCategoryId } from "../../services/validates/category";
import {
  addValidate,
  updateValidate,
  validateTransactionId,
} from "../../services/validates/transaction";
import { validateWalletId } from "../../services/validates/wallet";

const router = createRouter();
router.prefix("/transaction");
router.use(
  passport.authenticate("jwt", { session: false, failWithError: true })
);

router
  // Delete transaction
  .delete("/:id", validateTransactionId, transaction.deleteTransaction)
  // Update transaction
  .post(
    "/:id",
    { validate: { body: updateValidate, type: "json" } },
    validateTransactionId,
    validateWalletId(true),
    validateCategoryId(true),
    transaction.updateTransaction
  )
  //Get transaction
  .get("/:id", validateTransactionId, transaction.getTransaction)
  //Add transaction
  .post(
    "/",
    { validate: { body: addValidate, type: "json" } },
    validateWalletId(true),
    validateCategoryId(true),
    transaction.addTransaction
  );

export default router;
