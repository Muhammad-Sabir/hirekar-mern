import express from "express";
import {
  getAllWorkers,
  getWorkers,
  getRecommendedWorkers,
  searchWorkers,
  workerDetails,
} from "../controllers/workerController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/all", authMiddleware, getAllWorkers);
router.get("/distance", authMiddleware, getWorkers);
router.get("/recommended", authMiddleware, getRecommendedWorkers);
router.get("/search", authMiddleware, searchWorkers);
router.get("/:worker_id", authMiddleware, workerDetails);

export default router;
