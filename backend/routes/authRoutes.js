import express from "express";
import {
  signup,
  login,
  verifyUserOtp,
  sendOtp,
} from "../controllers/authController.js";
import {
  signupValidator,
  loginValidator,
  otpValidator,
} from "../validators/authValidator.js";

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", otpValidator, verifyUserOtp);

export default router;
