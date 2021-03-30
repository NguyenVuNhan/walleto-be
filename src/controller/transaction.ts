import { Context } from "koa";
import {
  responsesAll,
  tagsAll,
  securityAll,
  prefix,
  body,
  request,
  summary,
  query,
} from "koa-swagger-decorator";
import { Between } from "typeorm";
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
  @request("get", "/")
  @summary("Get all current user transaction")
  @query({
    from: { type: "string", format: "date" },
    to: { type: "string", format: "date" },
  })
  public static async getAll(ctx: Context) {
    const transactionRepository = getTransactionRepository();

    let { from, to } = ctx.request.query;
    if (!from || !to) {
      const d = new Date();
      if (!to) {
        const date = d.toISOString().split("T")[0];
        to = date + "T23:59:59.999Z";
      }
      if (!from) {
        d.setDate(1);
        const date = d.toISOString().split("T")[0];
        from = date + "T00:00:00.000Z";
      }
    }

    const transactions: Transaction[] = await transactionRepository
      .createQueryBuilder("t")
      .where({
        user: ctx.state.user,
        date: Between(from, to),
      })
      .leftJoinAndMapOne("t.category", "t.category", "c")
      .select([
        "t.id AS id",
        "t.note AS note",
        "t.amount AS amount",
        "t.date AS date",
        "c.name AS category",
      ])
      .getRawMany();

    ctx.body = {
      data: { transactions },
      message: "Get all transaction success",
      success: true,
    };
  }

  @request("delete", "/:id")
  @summary("Delete a transaction")
  public static async delete(ctx: Context) {
    const transactionRepository = getTransactionRepository();

    // Delete transaction
    const deleteTransaction: Transaction = ctx.state.transaction;
    const transaction = await transactionRepository.remove(deleteTransaction);

    // Update wallet amount
    const walletRepository = getWalletRepository();
    const query = { id: transaction.wallet.id, user: ctx.state.user };
    const wallet = await walletRepository.findOne(query, {
      relations: ["user"],
    });
    await walletRepository.update(query, {
      balance: wallet.balance - transaction.amount,
    });

    ctx.body = {
      data: { ...transaction },
      message: "Wallet found",
      success: true,
    };
  }

  @request("post", "/")
  @summary("Update a transaction")
  @body(transactionSchema)
  public static async update(ctx: Context) {
    const transactionRepository = getTransactionRepository();
    const walletRepository = getWalletRepository();

    const transaction: Transaction = ctx.state.transaction;
    const wallet: Wallet = ctx.state.wallet || transaction.wallet;

    // Update new balance for wallet
    let amount: number = ctx.request.body.amount;
    if (amount || amount === 0) {
      const category = ctx.state.category || transaction.category;

      // Check for amount
      if (category.type === "Expense" && amount > 0) amount *= -1;
      else if (category.type === "Income" && amount < 0) amount *= -1;

      ctx.request.body.amount = amount;

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
  public static async getOne(ctx: Context) {
    ctx.body = {
      data: { ...ctx.state.transaction },
      message: "Get transaction success",
      success: true,
    };
  }

  @request("post", "/")
  @summary("Add a transaction")
  @body(transactionSchema)
  public static async add(ctx: Context) {
    const transactionRepository = getTransactionRepository();
    const walletRepository = getWalletRepository();

    const wallet: Wallet = ctx.state.wallet;
    await walletRepository.update(
      { id: wallet.id, user: wallet.user },
      { balance: wallet.balance + ctx.request.body.amount }
    );

    let { note, category, amount, date, exclude } = ctx.request.body;

    if (category.type === "Expense" && amount > 0) amount *= -1;
    else if (category.type === "Income" && amount < 0) amount *= -1;

    const newTransaction = new Transaction();
    newTransaction.note = note;
    newTransaction.amount = amount;
    newTransaction.date = date;
    newTransaction.exclude = exclude;
    newTransaction.user = ctx.state.user;
    newTransaction.category = category;
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
