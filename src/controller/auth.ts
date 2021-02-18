import { Context } from "koa";
import { body, request, summary } from "koa-swagger-decorator";
import { getManager, Repository } from "typeorm";
import { User, userSchema } from "../entity/user";
import { pick } from "../helper/utils";

export default class AuthController {
  @request("post", "/login")
  @summary("User login")
  @body(pick(userSchema, ["name", "password"]))
  public static async login(ctx: Context): Promise<void> {
    const userRepository: Repository<User> = getManager().getRepository(User);
    const { name_email, password } = ctx.request.body;

    const user: User = await userRepository.findOne({
      where: [{ email: name_email }, { name: name_email }],
    });

    if (!user) {
      ctx.throw(400, "Unable to find this user");
    }

    if (!user.comparePassword(password)) {
      ctx.throw(400, "Password not match");
    }

    ctx.status = 200;
    ctx.body = user;
  }

  @request("post", "/register")
  @summary("Register for new user")
  @body(userSchema)
  public static async register(ctx: Context): Promise<void> {
    const userRepository: Repository<User> = getManager().getRepository(User);
    const newUser: User = new User();
    newUser.name = ctx.request.body.name;
    newUser.email = ctx.request.body.email;
    newUser.password = ctx.request.body.password;
    newUser.cPassword = ctx.request.body.cpassword;

    if (await userRepository.findOne({ name: newUser.name })) {
      ctx.throw(400, "This user name already exists");
    }

    if (await userRepository.findOne({ email: newUser.email })) {
      ctx.throw(400, "This email already exists");
    }

    const user = await userRepository.save(newUser);

    // Hide sensitive fields
    delete user.password;
    delete user.cPassword;

    ctx.status = 200;
    ctx.body = user;
  }
}
