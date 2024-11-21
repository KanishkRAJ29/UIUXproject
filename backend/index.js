import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {dbConnections} from "./database/dbConnections.js"
import messageRouter from "./router/messageRouter.js"
import checkoutRouter from "./router/donateR.js"
const app= express();
dotenv.config({path: "./config.env"})

app.use(cors({
  origin:[process.env.FRONTEND_URL],
  methods:["POST"],
  credentials: true,
}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});


app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use("/api/v1/message",messageRouter);
app.use("/api/v1",checkoutRouter);


app.get("/", (req, res) => {
  res.send("Welcome to the API! Use the /api/v1/message or /api/v1 endpoints.");
});

app.use((req, res, next) => {
  res.status(404).json({
      success: false,
      message: "The route you are trying to access does not exist on this server.",
  });
});

dbConnections();
export default app;