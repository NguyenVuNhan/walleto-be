import createRouter from "koa-joi-router";
import passport from "koa-passport";
import wallet from "../../controller/wallet";

const router = createRouter();
router.prefix("/wallet");
router.use(
  passport.authenticate("jwt", { session: false, failWithError: true })
);

router
  // Add wallet
  .post("/", wallet.addWallet);

export default router;
