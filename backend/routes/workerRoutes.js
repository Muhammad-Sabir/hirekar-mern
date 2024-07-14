import express from "express";
import {
  getAllWorkers,
  getRecommendedWorkers,
  searchWorkers,
  workerDetails,
  getNearbyWorkers
} from "../controllers/workerController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/all", authMiddleware, getAllWorkers);
router.get("/nearby/:user_id", authMiddleware, getNearbyWorkers);
router.get("/recommended", authMiddleware, getRecommendedWorkers);
router.get("/search", authMiddleware, searchWorkers);
router.get("/:worker_id", authMiddleware, workerDetails);

export default router;
