import createRouter from "koa-joi-router";
import category from "../../controller/category";
import passport from "koa-passport";
import {
  validateCategoryName,
  validateCategoryId,
  validateParent,
  updateValidate,
  addValidate,
} from "../../services/validates/category";

const router = createRouter();
router.prefix("/category");
router.use(
  passport.authenticate("jwt", { session: false, failWithError: true })
);

router
  // Get category
  .get("/", category.get)
  // Add category
  .post(
    "/",
    { validate: { body: addValidate, type: "json" } },
    validateCategoryName,
    validateParent,
    category.add
  )
  // Update category
  .post(
    "/:id",
    { validate: { body: updateValidate, type: "json" } },
    validateCategoryName,
    validateParent,
    category.update
  )
  // Delete category
  .delete("/:id", validateCategoryId(), category.delete);

export default router;
