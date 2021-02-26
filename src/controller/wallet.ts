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
@tagsAll(["Wallet"])
@securityAll([{ BearerAuth: [] }])
@prefix("wallet")
export default class WalletController {
  @request("delete", "/:id")
  @summary("Delete wallet with id")
  public static async delete(ctx: Context) {
    const walletRepository = getWalletRepository();

    const deleteWallet: Wallet = ctx.state.wallet;
    const wallet = await walletRepository.remove(deleteWallet);
    delete wallet.user;

    ctx.body = {
      data: { ...wallet },
      message: "Wallet found",
      success: true,
    };
  }

  @request("post", "/:id")
  @summary("Update wallet with id")
  public static async update(ctx: Context) {
    const walletRepository = getWalletRepository();

    const query = { id: Number(ctx.request.params.id), user: ctx.state.user };

    // Update wallet
    const updateRes = await walletRepository.update(query, {
      ...ctx.request.body,
    });
    if (!updateRes.affected) {
      ctx.throw(404, "Unable to find this wallet");
    }

    // Get updated wallet
    const wallet = await walletRepository.findOne(query);

    ctx.body = {
      data: { ...wallet },
      message: "Wallet found",
      success: true,
    };
  }

  @request("get", "/:id")
  @summary("Find wallet with id")
  public static async getOne(ctx: Context) {
    delete ctx.state.wallet.user;

    ctx.body = {
      data: { ...ctx.state.wallet },
      message: "Wallet found",
      success: true,
    };
  }

  @request("post", "/")
  @summary("Add new wallet")
  @body(omit(walletSchema, ["archive"]))
  public static async add(ctx: Context) {
    const walletRepository = getWalletRepository();

    const newWallet = new Wallet();
    newWallet.name = ctx.request.body.name;
    newWallet.currency = String(ctx.request.body.currency).toUpperCase();
    newWallet.balance = ctx.request.body.balance;
    newWallet.exclude = ctx.request.body.exclude;
    newWallet.archived = ctx.request.body.archived;
    newWallet.user = ctx.state.user;

    const wallet = await walletRepository.save(newWallet);

    ctx.body = {
      data: { ...wallet },
      message: "New wallet created",
      success: true,
    };
  }
}
