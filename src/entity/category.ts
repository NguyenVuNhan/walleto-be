import {
  Column,
  Entity,
  getManager,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Repository,
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

  @ManyToOne(() => User, (user) => user.category, {
    primary: true,
    cascade: true,
  })
  user: User;

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
