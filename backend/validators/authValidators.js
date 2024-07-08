import { body } from "express-validator";

export const signupValidator = [
  body("name").isString().notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("role").isIn(["employer", "worker"]),
];

export const loginValidator = [
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
];
