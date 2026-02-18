import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import scoresRouter from "./routes/scores.route.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.json({ status: "server is on" });
});
//scores routes
app.use("/api/scores", scoresRouter);

httpServer.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});


export { app, httpServer } 