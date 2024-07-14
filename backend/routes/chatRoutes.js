import express from "express";
import {
  getAllChats,
  sendMessage,
  getAllMessages,
} from "../controllers/chatController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/chats/:userId", authMiddleware, getAllChats);
router.post("/message", authMiddleware, sendMessage);
router.get("/messages/:chat_id", authMiddleware, getAllMessages);

export default router;
