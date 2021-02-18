import auth from "../../controller/auth";
import createRouter, { Joi, Spec } from "koa-joi-router";
import { pick, omit } from "../../helper/utils";

const route = createRouter();
route.prefix("/auth");

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
      "string.pattern.base": "{{#label}} is too week",
    }),
  cpassword: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm Password")
    .messages({
      "any.only": "{{#label}} does not match",
    }),
};

const routes: Spec[] = [
  {
    method: "post",
    path: "/login",
    validate: {
      body: pick(commonValidate, ["name_email", "password"]),
      type: "form",
    },
    handler: auth.login,
  },
  {
    method: "post",
    path: "/register",
    validate: { body: omit(commonValidate, ["name_email"]), type: "form" },
    handler: auth.register,
  },
];

route.route(routes);

export default route;
