import {
  Column,
  Entity,
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

  @Column()
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

export const walletSchema = {};
