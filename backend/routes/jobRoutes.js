import express from "express";
import {
  hireWorker,
  jobHistory,
  updateJobStatus,
} from "../controllers/jobController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, hireWorker);
router.get("/history", authMiddleware, jobHistory);
router.patch("/:id", authMiddleware, updateJobStatus);

export default router;
