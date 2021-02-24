import { Context, Next } from "koa";
import { Joi } from "koa-joi-router";
import { getCategoryRepository } from "../../entity/category";

export const updateValidate = {
  name: Joi.string().label("Category name"),
  type: Joi.string().valid("Expense", "Income").label("Category type"),
  parent: [Joi.number().label("Category parent"), Joi.allow(null)],
};

export const addValidate = {
  ...updateValidate,
  name: updateValidate.name.required(),
  type: updateValidate.type.required(),
};

export const validateCategoryId = async (
  ctx: Context,
  next: Next
): Promise<void> => {
  const categoryRepository = getCategoryRepository();

  const id = ctx.request.params.id
    ? Number(ctx.request.params.id)
    : ctx.request.body.categoryId;

  const category = await categoryRepository.findOne(
    { id, user: ctx.state.user },
    { relations: ["user", "children"] }
  );

  if (!category) {
    ctx.throw(404, "Unable to find this category");
  }

  ctx.state.category = category;

  await next();
};

export const validateCategoryName = async (
  ctx: Context,
  next: Next
): Promise<void> => {
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

  await next();
};

// Parent validate middleware
export const validateParent = async (
  ctx: Context,
  next: Next
): Promise<void> => {
  const categoryRepository = getCategoryRepository();

  // Check for valid parent id
  if (ctx.request.body.parent) {
    const parentCategory = await categoryRepository.findOne(
      {
        id: ctx.request.body.parent,
        type: ctx.request.body.type || ctx.state.category.type,
      },
      { relations: ["user", "parent"] }
    );

    // If user give an invalid parent id
    if (!parentCategory) {
      ctx.throw(400, "Cannot find parent category");
    }

    if (parentCategory.parent) {
      ctx.throw(400, "Invalid parent category");
    }

    ctx.request.body.parent = parentCategory;
  }

  await next();
};
