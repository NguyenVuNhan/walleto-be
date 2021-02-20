import createRouter, { Spec } from "koa-joi-router";
import category from "../../controller/category";
import passport from "koa-passport";

const router = createRouter();
router.use(
  passport.authenticate("jwt", { session: false, failWithError: true })
);

const routes: Spec[] = [
  {
    method: "get",
    path: "/category",
    handler: category.getCategory,
  },
  {
    method: "post",
    path: "/category",
    handler: [category.validateParent, category.addCategory],
  },
];

router.route(routes);

export default router;
