import bcrypt from "bcryptjs";
import { IsEmail, Length } from "class-validator";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ length: 80 })
  @Length(3, 80, { message: "User name should between 3 and 80 characters" })
  name: string;

  @Column({ length: 100 })
  @Length(10, 80, { message: "Email should between 10 and 80 characters" })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    const user = this;
    if (!user.password) {
      return;
    }

    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        throw err;
      }

      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          throw err;
        }

        user.password = hash;
      });
    });
  }

  comparePassword(
    requestPassword: string,
    cb: (error: Error, result: boolean) => void
  ) {
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
