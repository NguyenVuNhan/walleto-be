import Joi from "joi";
import { Context, Next } from "koa";
import { getWalletRepository } from "../../entity/wallet";
import joiValidate from "./joiValidate";

const commonValidate = {
  name: Joi.string().label("Wallet name"),
  currency: Joi.string().label("Currency"),
  balance: Joi.number().label("Balance"),
  exclude: Joi.bool().label("Is excluded from report"),
  archived: Joi.bool().label("Is archived"),
};

export const updateValidate = joiValidate(Joi.object(commonValidate));

export const addValidate = joiValidate(
  Joi.object({
    ...commonValidate,
    name: commonValidate.name.required(),
    currency: commonValidate.currency.required(),
  })
);

// Validate wallet with given wallet id and save wallet to state
export const validateWalletId = (ignoreParams = false) => async (
  ctx: Context,
  next: Next
) => {
  const walletRepository = getWalletRepository();

  const id = !ignoreParams
    ? Number(ctx.request.params.id)
    : ctx.request.body.walletId;

  if (id) {
    const wallet = await walletRepository
      .createQueryBuilder("w")
      .where({ id, user: ctx.state.user })
      .getOne();

    if (!wallet) {
      ctx.throw(404, "Unable to find this wallet");
    }

    ctx.state.wallet = wallet;
    if (ignoreParams) {
      delete ctx.request.body.walletId;
      ctx.request.body.wallet = wallet;
    }
  }

  await next();
};

// Check if wallet name has been used by current user
export const validateWalletName = async (ctx: Context, next: Next) => {
  const name = ctx.request.body.name;
  if (name) {
    const walletRepository = getWalletRepository();

    if (
      await walletRepository.findOne(
        { name: ctx.request.body.name, user: ctx.state.user },
        { relations: ["user"] }
      )
    ) {
      ctx.throw(400, "This wallet already exists");
    }
  }

  await next();
};
