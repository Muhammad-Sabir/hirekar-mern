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
import {
  authMiddleware,
  corsMiddleware,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/chats/", corsMiddleware, authMiddleware, getAllChats);
router.post("/access-chat/", corsMiddleware, authMiddleware, accessChat);
router.post("/message", corsMiddleware, authMiddleware, sendMessage);
router.get(
  "/messages/:chat_id",
  corsMiddleware,
  authMiddleware,
  getAllMessages
);
router.post("/block/:chat_id", corsMiddleware, authMiddleware, blockUser);
router.post("/unblock/:chat_id", corsMiddleware, authMiddleware, unblockUser);
router.get("/:chat_id", corsMiddleware, authMiddleware, getChatDetails);

export default router;
