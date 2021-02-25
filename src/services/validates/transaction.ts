import { Context, Next } from "koa";
import { Joi } from "koa-joi-router";
import { getTransactionRepository } from "../../entity/transaction";

export const updateValidate = {
  note: Joi.string().label("Note"),
  amount: Joi.number().label("Amount"),
  date: Joi.date().label("Date"),
  categoryId: Joi.number().label("Category Id"),
  walletId: Joi.number().label("Wallet Id"),
};

export const addValidate = {
  ...updateValidate,
  amount: updateValidate.amount.required(),
  categoryId: updateValidate.categoryId.required(),
  walletId: updateValidate.walletId.required(),
};

export const validateTransactionId = async (ctx: Context, next: Next) => {
  const transactionRepository = getTransactionRepository();

  // Find transaction from db
  const transaction = await transactionRepository.findOne(
    { id: Number(ctx.request.params.id), user: ctx.state.user },
    { relations: ["user", "wallet", "category"] }
  );

  // If unable to find this transaction
  if (!transaction) {
    ctx.throw(404, "Unable to find this transaction!");
  }

  // Transaction been found
  // Save transaction to state
  ctx.state.transaction = transaction;

  // Move to next middleware/route
  await next();
};
