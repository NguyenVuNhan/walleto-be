import bcrypt from "bcryptjs";
import { IsEmail, IsNotEmpty, Length, Matches } from "class-validator";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { error } from "winston";
import { Match } from "../helper/validator/Match";

@Entity()
export class User {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ length: 80 })
  @Length(3, 80, {
    message: "User name should between 3 and 80 characters",
  })
  name: string;

  @Column({ length: 100 })
  @Length(10, 80, {
    message: "Email should between 10 and 80 characters",
  })
  @IsEmail()
  email: string;

  @Column()
  // @IsDefined({ groups: [registerGroup], message: "Password is required" })
  @IsNotEmpty({ message: "Password is required" })
  @Length(4, 20, {
    message: "Password should between 4 and 20 characters",
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "password too weak",
  })
  password: string;

  // @IsDefined({
  //   groups: [registerGroup],
  //   message: "Confirm Password is required",
  // })
  @IsNotEmpty({ message: "Confirm password is required" })
  @Match("password", { message: "Confirm Password not match" })
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

  comparePassword(
    requestPassword: string,
    cb: (error: Error, result: boolean) => void
  ): void {
    bcrypt.compare(requestPassword, this.password, (err, isMatch) => {
      return cb(err, isMatch);
    });
  }
}

export const userSchema = {
  id: { type: "number", required: true, example: 1 },
  name: { type: "string", required: true, example: "John Doe" },
  email: { type: "string", required: true, example: "j.doe@example" },
  password: { type: "string", required: true, example: "password" },
};
