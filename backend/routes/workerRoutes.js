import express from "express";
import {
  getAllWorkers,
  getRecommendedWorkers,
  workerDetails,
  getNearbyWorkers,
} from "../controllers/workerController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/all", authMiddleware, getAllWorkers);
router.get("/nearby/", authMiddleware, getNearbyWorkers);
router.get("/recommended", authMiddleware, getRecommendedWorkers);
router.get("/:worker_id", authMiddleware, workerDetails);

export default router;
