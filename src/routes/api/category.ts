import category from "../../controller/category";
import passport from "koa-passport";
import {
  validateCategoryName,
  validateCategoryId,
  validateParent,
  updateValidate,
  addValidate,
} from "../../services/validates/category";
import Router from "@koa/router";
import { Context, DefaultState } from "koa";

const router = new Router<DefaultState, Context>();
router.prefix("/category");
router.use(
  passport.authenticate("jwt", { session: false, failWithError: true })
);

// Get category
router.get("/", category.get);

// Add category
router.post(
  "/",
  addValidate,
  validateCategoryName,
  validateParent,
  category.add
);

// Update category
router.post(
  "/:id",
  validateCategoryId(),
  updateValidate,
  validateCategoryName,
  validateParent,
  category.update
);

// Delete category
router.delete("/:id", validateCategoryId(), category.delete);

export default router;
