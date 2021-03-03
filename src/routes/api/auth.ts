import auth from "../../controller/auth";
import createRouter, { Joi } from "koa-joi-router";
import { pick, omit } from "../../helper/utils";

const router = createRouter();
router.prefix("/auth");

const commonValidate = {
  name_email: Joi.string()
    .min(3)
    .max(80)
    .required()
    .label("User name or Email"),
  name: Joi.string().min(3).max(80).required().label("User name"),
  email: Joi.string().min(3).max(80).email().required().label("Email"),
  password: Joi.string()
    .min(4)
    .max(20)
    .regex(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    .required()
    .label("Password")
    .messages({
      "string.pattern.base": "{{#label}} is invalid",
    }),
  cpassword: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm Password")
    .messages({
      "any.only": "{{#label}} does not match",
    }),
};

router
  .post(
    "/login",
    {
      validate: {
        body: pick(commonValidate, ["name_email", "password"]),
        type: "json"
      },
    },
    auth.login
  )
  .post(
    "/register",
    {
      validate: {
        body: omit(commonValidate, ["name_email"]),
        type: "json"
      },
    },
    auth.register
  );

export default router;
