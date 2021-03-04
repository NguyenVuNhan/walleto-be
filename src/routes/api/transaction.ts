import Router from "@koa/router";
import passport from "koa-passport";
import transaction from "../../controller/transaction";
import { validateCategoryId } from "../../services/validates/category";
import {
  addValidate,
  timeRangeValidate,
  updateValidate,
  validateTransactionId,
} from "../../services/validates/transaction";
import { validateWalletId } from "../../services/validates/wallet";

const router = new Router();
router.prefix("/transaction");
router.use(
  passport.authenticate("jwt", { session: false, failWithError: true })
);

router
  .get("/", timeRangeValidate, transaction.getAll)
  // Delete transaction
  .delete("/:id", validateTransactionId, transaction.delete)
  // Update transaction
  .post(
    "/:id",
    updateValidate,
    validateTransactionId,
    validateWalletId(true),
    validateCategoryId(true),
    transaction.update
  )
  //Get transaction
  .get("/:id", validateTransactionId, transaction.getOne)
  //Add transaction
  .post(
    "/",
    addValidate,
    validateWalletId(true),
    validateCategoryId(true),
    transaction.add
  );

export default router;
