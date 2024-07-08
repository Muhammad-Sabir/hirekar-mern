import express from "express";
import dotenv from "dotenv";
import connection from "./database/db.js";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_USERNAME;

connection(USERNAME, PASSWORD);

import authRoutes from "./routes/authRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/chats", chatRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
