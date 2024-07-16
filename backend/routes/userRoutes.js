import express from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile/", authMiddleware, getProfile);
router.patch("/profile/", authMiddleware, updateProfile);

export default router;
