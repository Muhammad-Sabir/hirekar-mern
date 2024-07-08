import express from "express";
import {
  listWorkers,
  searchWorkers,
  workerDetails,
  updateResume,
} from "../controllers/workerController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, listWorkers);
router.get("/search", authMiddleware, searchWorkers);
router.get("/:id", authMiddleware, workerDetails);

router.put("/:id", authMiddleware, updateResume);

export default router;
