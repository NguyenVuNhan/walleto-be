import Koa from "koa";
import passport from "koa-passport";
import { getUserRepository, User } from "../entity/user";
import * as JWT from "../services/strategies/JWT";
import { error } from "./logger";

export const mountPassport = (app: Koa): void => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    console.log("serializeUser");
    done(null, (<User>user).id);
  });

  passport.deserializeUser((id: string, done) => {
    console.log("deserializeUser");
    const userRepository = getUserRepository();
    userRepository
      .findOne(id)
      .then((user) => done(null, user))
      .catch((err) => done(err, false));
  });

  mountStrategy();
};

export const mountStrategy = (): void => {
  try {
    JWT.init(passport);
  } catch (err) {
    error("Passport error", err);
  }
};
