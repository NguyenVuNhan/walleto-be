import {
  Column,
  Entity,
  getManager,
  Index,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user";

@Entity()
@Index(["name", "user"], { unique: true })
export class Wallet {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @PrimaryColumn({ length: 80 })
  name: string;

  @Column()
  currency: string;

  @Column({ default: 0 })
  balance: number;

  @Column({ default: false })
  exclude: boolean;

  @Column({ default: false })
  archived: boolean;

  @ManyToOne(() => User, (user) => user.category, {
    primary: true,
    cascade: true,
  })
  user: User;
}

export const getWalletRepository = () => {
  return getManager().getRepository(Wallet);
};

export const walletSchema = {
  name: { type: "string", required: true, example: "Saving" },
  currency: { type: "string", required: true, example: "euro" },
  balance: { type: "number", required: false, example: "100" },
  exclude: { type: "boolean", required: false, example: "false" },
  archive: { type: "boolean", required: false, example: "false" },
};
