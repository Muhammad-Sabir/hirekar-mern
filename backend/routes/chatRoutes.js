import express from "express";
import { sendMessage, getMessages } from "../controllers/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, sendMessage);
router.get("/:chat_id", authMiddleware, getMessages);

export default router;
