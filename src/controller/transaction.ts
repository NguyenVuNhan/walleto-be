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
  @request("post", "/")
  @summary("Update a transaction")
  @body(transactionSchema)
  public static async updateTransaction(ctx: Context) {
    const transactionRepository = getTransactionRepository();
    const walletRepository = getWalletRepository();

    const transaction: Transaction = ctx.state.transaction;
    const wallet: Wallet = ctx.state.wallet || transaction.wallet;

    // Update new ballance for wallet
    const amount: number = ctx.request.body.amount;
    if (amount || amount === 0) {
      const balance = wallet.balance - transaction.amount + amount;
      walletRepository.update(
        { id: wallet.id, user: ctx.state.user },
        { balance }
      );
    }

    // Update transaction and get updated transaction details
    const query = {
      id: Number(ctx.request.params.id),
      user: ctx.state.user,
    };
    await transactionRepository.update(query, {
      ...ctx.request.body,
    });
    const updatedTransaction = await transactionRepository.findOne(query);

    ctx.body = {
      data: { ...updatedTransaction },
      message: "Update transaction success",
      success: true,
    };
  }

  @request("get", "/:id")
  @summary("Get a transaction")
  public static async getTransaction(ctx: Context) {
    //Remove user sensitive data
    delete ctx.state.transaction.user.password;

    ctx.body = {
      data: { ...ctx.state.transaction },
      message: "Get transaction success",
      success: true,
    };
  }

  @request("post", "/")
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
