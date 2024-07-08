import express from "express";
import {
  signupValidator,
  loginValidator,
} from "../validators/authValidators.js";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);

export default router;
