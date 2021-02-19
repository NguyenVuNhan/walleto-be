import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user";

@Entity()
@Index(["name", "user"], { unique: true })
export class Category {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @PrimaryColumn({ length: 80 })
  name: string;

  @Column({ update: false })
  type: string;

  @Column({ default: false })
  isIncome: boolean;

  @Column({ default: false })
  isExpense: boolean;

  @ManyToOne(() => User, (user) => user.id, { primary: true })
  user: User;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
  })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent, { nullable: true })
  children: Category[];
}

export const categorySchema = {
  name: { type: "string", required: true, example: "Education" },
};
