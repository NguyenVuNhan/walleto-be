import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { getUserRepository } from "../../entity/user";
import { config } from "../../provider/config";

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};

export const init = (passport: typeof import("koa-passport")): void => {
  passport.use(
    new Strategy(opts, (payload, done) => {
      const userRepository = getUserRepository();
      userRepository
        .findOne(payload.id)
        .then((user) => (user ? done(null, user) : done(null, false)))
        .catch((err) => done(err, false));
    })
  );
};
