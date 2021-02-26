import {
  Column,
  Entity,
  getManager,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Repository,
  Unique,
} from "typeorm";
import { Transaction } from "./transaction";
import { User } from "./user";

@Entity()
@Unique(["name", "user"])
export class Category {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ length: 80 })
  name: string;

  @Column({ update: false, type: "enum", enum: ["Expense", "Income"] })
  type: "Expense" | "Income";

  @ManyToOne(() => User, (user) => user.category, {
    cascade: true,
  })
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transaction: Transaction[];

  @ManyToOne(() => Category, (category) => category.children, {
    cascade: true,
    nullable: true,
  })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];
}

export const getCategoryRepository = (): Repository<Category> => {
  return getManager().getRepository(Category);
};

export const categorySchema = {
  name: { type: "string", required: true, example: "Education" },
  type: { type: "string", required: true, example: "Expense" },
  parent: { type: "string", required: false, example: "12" },
};
