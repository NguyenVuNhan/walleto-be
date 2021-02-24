import { Joi } from "koa-joi-router";

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
