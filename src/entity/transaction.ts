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

  @Column({ type: "text" })
  note: string;

  @Column()
  amount: number;

  @Column({ type: "timestamp without time zone", default: () => "now()" })
  date: Date;

  @ManyToOne(() => User, (user) => user.transaction, {
    orphanedRowAction: "delete",
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

export const transactionSchema = {};
