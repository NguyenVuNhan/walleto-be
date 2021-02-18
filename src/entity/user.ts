import bcrypt from "bcryptjs";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { error } from "winston";

@Entity()
export class User {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ length: 80 })
  name: string;

  @Column({ length: 100 })
  email: string;

  @Column()
  password: string;

  cPassword: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    const user = this;
    if (!user.password) {
      return;
    }

    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    } catch (err) {
      error("Password hashing error", err);
      throw new Error("Error while saving user");
    }
  }

  async comparePassword(requestPassword: string): Promise<boolean> {
    return await bcrypt.compare(requestPassword, this.password);
  }
}

export const userSchema = {
  name: { type: "string", required: true, example: "John Doe" },
  email: { type: "string", required: true, example: "j.doe@example" },
  password: { type: "string", required: true, example: "password" },
  cpassword: { type: "string", required: true, example: "password" },
};
