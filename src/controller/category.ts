import { Context, Next } from "koa";
import {
  body,
  query,
  request,
  responsesAll,
  securityAll,
  summary,
  tagsAll,
} from "koa-swagger-decorator";
import { IsNull } from "typeorm";
import {
  Category,
  categorySchema,
  getCategoryRepository,
} from "../entity/category";

@responsesAll({
  200: { description: "success" },
  400: { description: "bad request" },
  401: { description: "unauthorized, missing/wrong jwt token" },
})
@tagsAll(["Category"])
@securityAll([{ BearerAuth: [] }])
export default class CategoryController {
  @request("delete", "/category/:id")
  @summary("Delete a category")
  @query({ id: { type: "string", required: true, example: "12" } })
  public static async deleteCategory(ctx: Context): Promise<void> {
    const categoryRepository = getCategoryRepository();

    const deleteCategory = await categoryRepository.findOne(
      {
        id: Number(ctx.request.params.id),
        user: ctx.state.user,
      },
      { relations: ["user", "children"] }
    );

    if (!deleteCategory) {
      ctx.throw(400, "Unable to find this category");
    }

    if (deleteCategory.children.length > 0) {
      ctx.throw(
        400,
        "Unable to delete this category. Remove all it's children then try again."
      );
    }

    const category = await categoryRepository.remove(deleteCategory);
    delete category.user.password;

    ctx.body = {
      data: {
        category,
      },
      message: "New category added!",
      success: true,
    };
  }

  @request("get", "/category")
  @summary("Get all user category")
  public static async getCategory(ctx: Context): Promise<void> {
    const categoryRepository = getCategoryRepository();

    const categories = await categoryRepository.find({
      where: { parent: IsNull() },
      relations: ["children"],
    });

    ctx.body = {
      data: {
        categories,
      },
      message: "New category added!",
      success: true,
    };
  }

  @request("post", "/category")
  @summary("Add new category")
  @body(categorySchema)
  public static async addCategory(ctx: Context): Promise<void> {
    const categoryRepository = getCategoryRepository();

    // Check for any category of current user exist with the same name
    if (
      await categoryRepository.findOne(
        { name: ctx.request.body.name, user: ctx.state.user },
        { relations: ["user"] }
      )
    ) {
      ctx.throw(400, "This category already exists!");
    }

    const newCategory = new Category();
    newCategory.name = ctx.request.body.name;
    newCategory.type = ctx.request.body.type;
    newCategory.user = ctx.state.user;
    newCategory.parent = ctx.request.body.parent;

    // Save new category
    const category = await categoryRepository.save(newCategory);

    delete category.parent.user;

    ctx.body = {
      data: {
        ...category,
      },
      message: "New category added!",
      success: true,
    };
  }

  // Parent validate middleware
  public static async validateParent(ctx: Context, next: Next): Promise<void> {
    const categoryRepository = getCategoryRepository();

    // Check for valid parent id
    if (ctx.request.body.parent) {
      const parentCategory = await categoryRepository.findOne(
        {
          id: ctx.request.body.parent,
        },
        { relations: ["user", "parent"] }
      );

      // If user give an invalid parent id
      if (!parentCategory) {
        ctx.throw(400, "Cannot find parent category");
      }

      // If the type of current category is different with parent category
      if (parentCategory.type !== ctx.request.body.type) {
        ctx.throw(400, "Cannot find parent category");
      }

      if (parentCategory.parent) {
        ctx.throw(400, "Invalid parent category");
      }

      ctx.request.body.parent = parentCategory;
    }

    await next();
  }
}
