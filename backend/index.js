import express from "express";
import dotenv from "dotenv";
import connection from "./database/db.js";
import bodyParser from "body-parser";
import cors from "cors";
import { Server } from "socket.io";

dotenv.config();

const app = express();
app.options("*", cors());
app.use(cors());
app.use(bodyParser.json());

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;

connection(USERNAME, PASSWORD);

import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";

app.use("/api/chatbot", chatbotRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/worker", workerRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// const io = new Server(server, {
//   pingTimeout: 60000,
//   cors: {
//     origin: "http://hirekar-frontend.s3-website.eu-north-1.amazonaws.com",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("Connected to socket.io");

//   socket.on("setup", (userData) => {
//     socket.join(userData._id);
//     console.log("User Id Setup: ", userData._id);
//     socket.emit("Connected!");
//   });

//   socket.on("join chat", (room) => {
//     socket.join(room);
//     console.log("Joined room: ", room);
//   });

//   socket.on("new message", (newMessageReceived) => {
//     let chat = newMessageReceived.chat_id;

//     if (!chat.users) {
//       console.error("Invalid chat ID");
//       return;
//     }

//     chat.users.forEach((user) => {
//       if (user._id === newMessageReceived.sender_id._id) return;

//       socket.in(user._id).emit("message received", newMessageReceived);
//     });
//   });
// });
