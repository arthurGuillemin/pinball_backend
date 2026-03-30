//libs
import express from "express";
import dotenv from "dotenv";
import scoresRouter from "./routes/scores.route.js";
import cors from "cors";
import pinoHttp from "pino-http";
//functions
import { setupWebSockets } from "./sockets/index.js";
import { createServer } from "http";
import errorHandler from "./middlewares/errorHandler.js";
import AppError from "./utils/appError.js";
import logger from "./utils/logger.js";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
const httpServer = createServer(app);

// cors
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? allowedOrigins : "*",
  }),
);

app.use(express.json());
app.use(pinoHttp({ logger, redact: ["req.headers.authorization"] }));

// test route
app.get("/", (req, res) => {
  res.json({ status: "server is on" });
});

// scores routes
app.use("/api/scores", scoresRouter);

// WebSockets
setupWebSockets(httpServer);

httpServer.listen(PORT, () => {
  logger.info(`Serveur lancé sur le port ${PORT}`);
});

app.use(errorHandler);
export { app, httpServer };
