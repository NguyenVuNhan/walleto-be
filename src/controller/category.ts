import { Context } from "koa";
import {
  request,
  responsesAll,
  securityAll,
  summary,
  tagsAll,
} from "koa-swagger-decorator";

@responsesAll({
  200: { description: "success" },
  400: { description: "bad request" },
  401: { description: "unauthorized, missing/wrong jwt token" },
})
@tagsAll(["Category"])
@securityAll([{ BearerAuth: [] }])
export default class CategoryController {
  @request("get", "/category")
  @summary("Get all user category")
  public static async getCategory(ctx: Context): Promise<void> {
    ctx.body = {
      hello: "hello",
      auth: ctx.isAuthenticated(),
      header: ctx.header,
    };
  }
}
