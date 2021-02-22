import { Context } from "koa";
import {
  body,
  prefix,
  request,
  responsesAll,
  securityAll,
  summary,
  tagsAll,
} from "koa-swagger-decorator";
import { getWalletRepository, Wallet, walletSchema } from "../entity/wallet";
import { omit } from "../helper/utils";

@responsesAll({
  200: { description: "success" },
  400: { description: "bad request" },
  401: { description: "unauthorized, missing/wrong jwt token" },
})
@tagsAll(["Category"])
@securityAll([{ BearerAuth: [] }])
@prefix("wallet")
export default class WalletController {
  @request("post", "/")
  @summary("Add new wallet")
  @body(omit(walletSchema, ["archive"]))
  public static async addWallet(ctx: Context) {
    const walletRepository = getWalletRepository();

    if (
      await walletRepository.findOne(
        { name: ctx.request.body.name, user: ctx.state.user },
        { relations: ["user"] }
      )
    ) {
      ctx.throw(400, "This wallet already exists");
    }

    const newWallet = new Wallet();
    newWallet.name = ctx.request.body.name;
    newWallet.currency = String(ctx.request.body.currency).toUpperCase();
    newWallet.balance = ctx.request.body.balance;
    newWallet.exclude = ctx.request.body.exclude;
    newWallet.archived = ctx.request.body.archived;
    newWallet.user = ctx.state.user;

    const wallet = await walletRepository.save(newWallet);

    ctx.body = {
      data: {
        ...wallet,
      },
      message: "New wallet created",
      success: true,
    };
  }
}
