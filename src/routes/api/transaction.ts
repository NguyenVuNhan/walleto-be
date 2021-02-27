import createRouter from "koa-joi-router";
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

const router = createRouter();
router.prefix("/transaction");
router.use(
  passport.authenticate("jwt", { session: false, failWithError: true })
);

router
  .get("/", { validate: { query: timeRangeValidate } }, transaction.getAll)
  // Delete transaction
  .delete("/:id", validateTransactionId, transaction.delete)
  // Update transaction
  .post(
    "/:id",
    { validate: { body: updateValidate, type: "json" } },
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
    { validate: { body: addValidate, type: "json" } },
    validateWalletId(true),
    validateCategoryId(true),
    transaction.add
  );

export default router;
