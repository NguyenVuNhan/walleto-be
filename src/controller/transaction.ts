import { Context } from "koa";
import {
  responsesAll,
  tagsAll,
  securityAll,
  prefix,
  body,
  request,
  summary,
} from "koa-swagger-decorator";
import {
  getTransactionRepository,
  Transaction,
  transactionSchema,
} from "../entity/transaction";
import { getWalletRepository, Wallet } from "../entity/wallet";

@responsesAll({
  200: { description: "success" },
  400: { description: "bad request" },
  401: { description: "unauthorized, missing/wrong jwt token" },
})
@tagsAll(["Transaction"])
@securityAll([{ BearerAuth: [] }])
@prefix("/transaction")
export default class TransactionController {
  @request("post", "/:id")
  @summary("Add a transaction")
  @body(transactionSchema)
  public static async addTransaction(ctx: Context) {
    const transactionRepository = getTransactionRepository();
    const walletRepository = getWalletRepository();

    const wallet: Wallet = ctx.state.wallet;
    await walletRepository.update(
      { id: wallet.id, user: wallet.user },
      { balance: wallet.balance + ctx.request.body.amount }
    );

    const newTransaction = new Transaction();
    newTransaction.note = ctx.request.body.note;
    newTransaction.amount = ctx.request.body.amount;
    newTransaction.date = ctx.request.body.date;
    newTransaction.user = ctx.state.user;
    newTransaction.category = ctx.state.category;
    newTransaction.wallet = wallet;

    const transaction = await transactionRepository.save(newTransaction);

    delete transaction.wallet;
    delete transaction.category;
    delete transaction.user;

    ctx.body = {
      data: { ...transaction },
      message: "Add transaction success",
      success: true,
    };
  }
}
