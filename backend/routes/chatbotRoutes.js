import express from "express";
import { corsMiddleware } from "../middlewares/authMiddleware.js";
import { chatbot } from "../controllers/chatbotController.js";

const router = express.Router();

router.post("/", corsMiddleware, chatbot);

export default router;
