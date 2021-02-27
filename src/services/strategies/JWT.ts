import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { getUserRepository } from "../../entity/user";
import { config } from "../../provider/config";

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};

export const init = (passport: typeof import("koa-passport")): void => {
  passport.use(
    new Strategy(opts, async (payload, done) => {
      const userRepository = getUserRepository();
      const user = await userRepository.findOne(payload.id);

      user ? done(null, user) : done(null, false);
    })
  );
};
