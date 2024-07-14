import express from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile/:user_id", authMiddleware, getProfile);
router.patch("/profile/:user_id", authMiddleware, updateProfile);

export default router;
