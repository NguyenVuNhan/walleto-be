import { Context, Next } from "koa";
import { getWalletRepository } from "../../entity/wallet";

// Validate wallet with given wallet id and save wallet to state
export const validateWalletId = async (ctx: Context, next: Next) => {
  const walletRepository = getWalletRepository();

  const wallet = await walletRepository.findOne({
    id: Number(ctx.request.params.id),
  });

  if (!wallet) {
    ctx.throw(404, "Unable to find this wallet");
  }

  ctx.state.wallet = wallet;
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
