import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn("increment")
  id: number;
}

export const walletSchema = {};
