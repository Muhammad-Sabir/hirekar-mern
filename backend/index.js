import express from "express";
import dotenv from "dotenv";
import connection from "./database/db.js";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_USERNAME;

connection(USERNAME, PASSWORD);

import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import userRoutes from "./routes/userRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/worker", workerRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
