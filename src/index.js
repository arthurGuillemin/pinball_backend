//libs
import express from "express";
import scoresRouter from "./routes/scores.route.js";
import cors from "cors";
import pinoHttp from "pino-http";
//functions
import { setupWebSockets } from "./sockets/index.js";
import { createServer } from "http";
import errorHandler from "./middlewares/errorHandler.js";
import AppError from "./utils/appError.js";
import logger from "./utils/logger.js";
import helmetMiddleware from "./middlewares/helmet.js";
import env from "./config/env.js";
const PORT = env.PORT;
const app = express();
const httpServer = createServer(app);

// cors
const allowedOrigins = env.ALLOWED_ORIGINS;
app.use(
  cors({
    origin: env.NODE_ENV === "production" ? allowedOrigins : "*",
  }),
);

app.use(express.json());
app.use(helmetMiddleware);
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
