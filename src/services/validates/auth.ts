import Joi from "joi";
import { omit, pick } from "../../helper/utils";
import joiValidate from "./joiValidate";

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

export const loginValidate = joiValidate(
  Joi.object(pick(commonValidate, ["name_email", "password"]))
);

export const registerValidate = joiValidate(
  Joi.object(omit(commonValidate, ["name_email"]))
);
