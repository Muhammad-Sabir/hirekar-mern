import express from "express";
import {
  createJob,
  assignJob,
  updateJob,
  getAllJobs,
  getRecommendedJobs,
  getNearbyJobs,
  getJobHistory,
} from "../controllers/jobController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createJob);
router.patch("/assign", authMiddleware, assignJob);
router.patch("/update", authMiddleware, updateJob);
router.get("/all", authMiddleware, getAllJobs);
router.get("/recommended/:user_id", authMiddleware, getRecommendedJobs);
router.get("/nearby", authMiddleware, getNearbyJobs);
router.get("/history/:user_id/:role", authMiddleware, getJobHistory);

export default router;
