import {
  Column,
  Entity,
  getManager,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./category";
import { User } from "./user";
import { Wallet } from "./wallet";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "text", default: "" })
  note: string;

  @Column()
  amount: number;

  @Column({ type: "timestamp without time zone", default: () => "now()" })
  date: Date;

  @Column({ type: "boolean", default: false })
  exclude: boolean;

  @ManyToOne(() => User, (user) => user.transaction, {
    cascade: true,
  })
  user: User;

  @ManyToOne(() => Category, (category) => category.transaction)
  category: Category;

  @ManyToOne(() => Wallet, (wallet) => wallet.transaction)
  wallet: Wallet;
}

export const getTransactionRepository = () => {
  return getManager().getRepository(Transaction);
};

export const transactionSchema = {
  note: { type: "string", example: "Water bill Nov 28" },
  amount: { type: "number", example: "1" },
  date: { type: "string", format: "date" },
  categoryId: { type: "number", example: "1" },
  walletId: { type: "number", example: "1" },
};
