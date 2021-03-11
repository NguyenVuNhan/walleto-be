import Joi from "joi";
import { Context, Next } from "koa";
import { getTransactionRepository } from "../../entity/transaction";
import joiValidate from "./joiValidate";

export const commonValidate = {
  note: Joi.string().label("Note"),
  amount: Joi.number().label("Amount"),
  date: Joi.date().label("Date"),
  categoryId: Joi.number().label("Category Id"),
  walletId: Joi.number().label("Wallet Id"),
};

export const updateValidate = joiValidate(Joi.object(commonValidate));

export const addValidate = joiValidate(
  Joi.object({
    ...commonValidate,
    amount: commonValidate.amount.required(),
    categoryId: commonValidate.categoryId.required(),
    walletId: commonValidate.walletId.required(),
  })
);

export const timeRangeValidate = joiValidate(
  Joi.object()
    .keys({
      from: Joi.date()
        .iso()
        .label("From")
        .when("to", {
          is: Joi.exist(),
          then: Joi.date()
            .max(Joi.ref("to"))
            .message('"From" must be less than or equal to "To"'),
          otherwise: Joi.date().max("now"),
        }),
    })
    .with("to", "from"),
  { subject: (ctx: Context) => ctx.request.query }
);

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
