import { Context } from "koa";
import { body, request, summary } from "koa-swagger-decorator";
import { getManager, Repository } from "typeorm";
import { User, userSchema } from "../entity/user";
import { validationErrorHandler } from "../exception/handler";

export default class AuthController {
  @request("post", "/register")
  @summary("Register for new user")
  @body(userSchema)
  public static async register(ctx: Context): Promise<void> {
    const userRepository: Repository<User> = getManager().getRepository(User);
    const newUser: User = new User();
    newUser.name = ctx.request.body.name;
    newUser.email = ctx.request.body.email;
    newUser.password = ctx.request.body.password;

    await validationErrorHandler(newUser, ctx);

    if (await userRepository.findOne({ email: newUser.email })) {
      ctx.throw(400, new Error("Email already exists"));
    }

    // TODO: fix save error
    const user = await userRepository.save(newUser);
    ctx.status = 200;
    ctx.body = user;
  }
}
