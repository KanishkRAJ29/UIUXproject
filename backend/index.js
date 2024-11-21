import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { dbConnections } from "./database/dbConnections.js";
import messageRouter from "./router/messageRouter.js";
import checkoutRouter from "./router/donateR.js";

const app = express();
dotenv.config({ path: "./config.env" });

app.use(cors({
  origin: [process.env.FRONTEND_URL], // Frontend URL should be in .env file
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true, // If you need to send cookies or authentication headers
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/message", messageRouter);
app.use("/api/v1", checkoutRouter);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the API! Use the /api/v1/message or /api/v1 endpoints.");
});

// 404 handler for non-existent routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "The route you are trying to access does not exist on this server.",
  });
});

// Database connection
dbConnections();

export default app;
