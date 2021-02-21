import createRouter, { Spec } from "koa-joi-router";
import category from "../../controller/category";
import passport from "koa-passport";

const router = createRouter();
router.use(
  passport.authenticate("jwt", { session: false, failWithError: true })
);

// TODO: add validation
const routes: Spec[] = [
  {
    method: "get",
    path: "/category",
    handler: category.getCategory,
  },
  {
    method: "post",
    path: "/category",
    handler: [
      category.checkCategoryName,
      category.validateParent,
      category.addCategory,
    ],
  },
  {
    method: "delete",
    path: "/category/:id",
    handler: [category.findCategoryById, category.deleteCategory],
  },
  {
    method: "post",
    path: "/category/:id",
    handler: [
      category.findCategoryById,
      category.checkCategoryName,
      category.validateParent,
      category.updateCategory,
    ],
  },
];

router.route(routes);

export default router;
