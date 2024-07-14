import express from "express";
import { addReview, getReviews } from "../controllers/reviewController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, addReview);
router.get("/:worker_id", authMiddleware, getReviews);

export default router;
