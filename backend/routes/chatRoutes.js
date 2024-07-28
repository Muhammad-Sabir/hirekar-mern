import express from "express";
import {
  getAllChats,
  sendMessage,
  getAllMessages,
  accessChat,
  blockUser,
  unblockUser,
  getChatDetails,
} from "../controllers/chatController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/chats/", authMiddleware, getAllChats);
router.post("/access-chat/", authMiddleware, accessChat);
router.post("/message", authMiddleware, sendMessage);
router.get("/messages/:chat_id", authMiddleware, getAllMessages);
router.post("/block/:chat_id", authMiddleware, blockUser);
router.post("/unblock/:chat_id", authMiddleware, unblockUser);
router.get("/:chat_id", authMiddleware, getChatDetails);

export default router;
