import { Context } from "koa";
import {
  body,
  prefix,
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
@prefix("/category")
export default class CategoryController {
  @request("post", "/:id")
  @summary("Update a category")
  @body(categorySchema)
  public static async update(ctx: Context): Promise<void> {
    const categoryRepository = getCategoryRepository();

    const query = {
      id: Number(ctx.request.params.id),
      user: ctx.state.user,
    };

    // Update category
    const updateRes = await categoryRepository.update(query, {
      ...ctx.request.body,
    });
    if (!updateRes.affected) {
      ctx.throw(404, "Unable to find this category");
    }

    // Find updated category
    const category = await categoryRepository.findOne(query);

    ctx.body = {
      data: { ...category },
      message: "Update category success",
      success: true,
    };
  }

  @request("delete", "/:id")
  @summary("Delete a category")
  public static async delete(ctx: Context): Promise<void> {
    const categoryRepository = getCategoryRepository();

    const deleteCategory: Category = ctx.state.category;
    if (deleteCategory.children.length > 0) {
      ctx.throw(
        400,
        "Unable to delete this category. Remove all it's children then try again."
      );
    }

    const category = await categoryRepository.remove(deleteCategory);

    ctx.body = {
      data: { ...category },
      message: "Delete category success",
      success: true,
    };
  }

  @request("get", "/")
  @summary("Get all user category")
  public static async get(ctx: Context): Promise<void> {
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

  @request("post", "/")
  @summary("Add new category")
  @body(categorySchema)
  public static async add(ctx: Context): Promise<void> {
    const categoryRepository = getCategoryRepository();

    const newCategory = new Category();
    newCategory.name = ctx.request.body.name;
    newCategory.type = ctx.request.body.type;
    newCategory.user = ctx.state.user;
    newCategory.parent = ctx.request.body.parent;

    // Save new category
    const category = await categoryRepository.save(newCategory);

    delete category.parent?.user;

    ctx.body = {
      data: { ...category },
      message: "New category added!",
      success: true,
    };
  }
}
